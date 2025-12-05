"use client"

import type React from "react"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCheckoutDetail } from "@/hooks/useCheckoutDetail"
import { useFetchClientsInfo } from "@/hooks/useFetchClients"
import { useCheckoutSetPayment } from "@/hooks/useCheckoutSetPayment"
import { useApiClient } from "@/lib/api/useApiClient"
import { makeClientService } from "@/clients/services/client.service"
import Modal from "@/app/customer/account/paymentMethods/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Visa from "@/assets/visa.svg"
import Mastercard from "@/assets/mastercard.svg"
import AmericanExpress from "@/assets/americanExpress.svg"
import Discover from "@/assets/discover.svg"
import UnionPay from "@/assets/unionPay.svg"
import JCB from "@/assets/jcb.svg"
import DinersClubInternational from "@/assets/dinersClub.svg"

function convertirExpiracionAISO(expirationString: string) {
  const partes = expirationString.split("/")
  if (partes.length !== 2) {
    return null
  }
  const mes = partes[0]?.trim()
  const anioCorta = partes[1]?.trim()
  if (!mes || !anioCorta || mes.length !== 2 || anioCorta.length !== 2) {
    return null
  }
  const month = Number.parseInt(mes, 10)
  const yearShort = Number.parseInt(anioCorta, 10)
  if (Number.isNaN(month) || month < 1 || month > 12) {
    return null
  }
  const yearFull = 2000 + yearShort
  const dia = "01"
  const monthPadded = String(month).padStart(2, "0")
  const fechaISO = `${yearFull}-${monthPadded}-${dia}`

  return fechaISO
}

enum Marcas {
  Visa = "VISA",
  Mastercard = "MASTERCARD",
  AmericanExpress = "AMERICAN EXPRESS",
  Discover = "DISCOVER",
  UnionPay = "UNION PAY",
  Jcb = "JCB",
  DinersClubInternational = "DINERS CLUB INTERNATIONAL",
}

export default function CheckoutPagoPage() {
  const searchParams = useSearchParams()
  const idPedidoParam = searchParams.get("id_pedido")
  const idPedido = idPedidoParam ? Number(idPedidoParam) : null

  const {
    items,
    subtotal,
    shipping,
    tax,
    total,
    isLoading,
    error,
  } = useCheckoutDetail(idPedido)

  const api = useApiClient()
  const clientService = useMemo(() => makeClientService(api), [api])
  const { paymentMethods } = useFetchClientsInfo()

  const {
    setPayment,
    isSettingPayment,
    errorSettingPayment,
  } = useCheckoutSetPayment()

  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false)
  const [tipo, setTipo] = useState<"C" | "D">("C")
  const [marca, setMarca] = useState<string>("")
  const [ultimos_digitos, setUltimosDigitos] = useState("")
  const [fecha_vencimiento, setFechaVencimiento] = useState("")
  const [codigo_seguridad, setCodigoSeguridad] = useState("")
  const [es_predeterminado, setEsPredeterminado] = useState(false)
  const [saving, setSaving] = useState(false)
  const [paymentMethodError, setPaymentMethodError] = useState<string | null>(null)
  const [isErrorPaymentModalOpen, setIsErrorPaymentModalOpen] = useState(false)
  const [errorPaymentMessage, setErrorPaymentMessage] = useState<string>("")

  const openMethodModal = (cardType: "C" | "D") => {
    setTipo(cardType)
    setMarca("")
    setUltimosDigitos("")
    setFechaVencimiento("")
    setCodigoSeguridad("")
    setEsPredeterminado(false)
    setPaymentMethodError(null)
    setIsMethodModalOpen(true)
  }

  const handleFechaVencimientoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    value = value.slice(0, 4)

    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`
    }

    setFechaVencimiento(value)
  }

  const resetForm = () => {
    setTipo("C")
    setMarca("")
    setUltimosDigitos("")
    setFechaVencimiento("")
    setCodigoSeguridad("")
    setEsPredeterminado(false)
    setPaymentMethodError(null)
  }

  const handlePaymentMethodSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!tipo.trim() || !ultimos_digitos.trim() || !fecha_vencimiento.trim() || !codigo_seguridad.trim()) {
      return
    }

    setSaving(true)
    try {
      setPaymentMethodError(null)
      const fechaISO = convertirExpiracionAISO(fecha_vencimiento)

      if (!fechaISO) {
        setPaymentMethodError("La fecha de vencimiento no es válida. Use el formato MM/AA.")
        setSaving(false)
        return
      }

      const digitsOnly = ultimos_digitos.replace(/\D/g, "")

      await clientService.insertPaymentMethod({
        tipo,
        marca: marca.trim(),
        ultimos_digitos: digitsOnly,
        fecha_vencimiento: fechaISO,
        codigo_seguridad: codigo_seguridad.trim(),
        es_predeterminado,
      })
      setIsMethodModalOpen(false)
      resetForm()
      if (typeof window !== "undefined") {
        window.location.reload()
      }
    } catch (err: any) {
      const backendMessage: string | undefined = err?.response?.data?.message
      if (backendMessage) {
        setPaymentMethodError(backendMessage)
      } else {
        setPaymentMethodError("Ocurrió un error al registrar el metodo de pago")
      }
    } finally {
      setSaving(false)
    }
  }

  const defaultMethod =
    paymentMethods.find((pm) => pm.es_predeterminada) ?? paymentMethods[0] ?? null

  const handleConfirmOrder = async () => {
    if (!idPedido || !defaultMethod) return

    const result = await setPayment({
      id_pedido: idPedido,
      id_metodo_pago: defaultMethod.id_metodo_pago,
    })

    if (!result) {
      const backendMessage = errorSettingPayment || "Pago fallido"
      setErrorPaymentMessage(backendMessage)
      setIsErrorPaymentModalOpen(true)
      return
    }

    if (result.code === 200) {
      const transaccion = result.transaccion
      const search = new URLSearchParams()
      if (idPedido) search.set("id_pedido", String(idPedido))
      if (transaccion) search.set("transaccion", transaccion)

      const url = `/customer/checkout/confirmacion?${search.toString()}`
      window.location.href = url
    } else {
      const backendMessage = result.message || "Pago fallido"
      setErrorPaymentMessage(backendMessage)
      setIsErrorPaymentModalOpen(true)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-foreground mb-8">Checkout - Pago</h1>

      <div className="flex gap-4 mb-12">
        {["Envío", "Pago", "Confirmación"].map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                index === 1
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm font-medium text-foreground">{label}</span>
            {index < 2 && <div className="flex-1 h-1 bg-border mx-2"></div>}
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumen del Pedido a la izquierda */}
          <div className="border border-border rounded-xl p-6 h-fit">
            <h2 className="text-xl font-semibold text-foreground mb-6">Resumen del Pedido</h2>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Cargando resumen...</div>
            ) : error ? (
              <div className="text-sm text-destructive">{error}</div>
            ) : items.length === 0 ? (
              <div className="text-sm text-muted-foreground">No se encontró información del pedido.</div>
            ) : (
              <>
                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Envío</span>
                    <span>S/ {shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Impuesto (18%)</span>
                    <span>S/ {tax.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {/* Selección de método de pago a la derecha */}
          <div className="lg:col-span-2 border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Método de Pago</h2>

            {paymentMethods.length === 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Aún no tienes métodos de pago guardados. Agrega una tarjeta para continuar.
                </p>
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent/10 text-left"
                    onClick={() => openMethodModal("C")}
                  >
                    <span className="font-medium">Tarjeta de crédito</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent/10 text-left"
                    onClick={() => openMethodModal("D")}
                  >
                    <span className="font-medium">Tarjeta de débito</span>
                  </button>
                </div>
              </>
            ) : defaultMethod ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Se utilizará tu método de pago predeterminado para este pedido.
                </p>
                <div className="border border-border rounded-xl p-4 flex items-center justify-between bg-card">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {defaultMethod.marca === Marcas.Visa && (
                        <Image src={Visa} alt="Visa" width={32} height={20} className="w-8 h-auto" />
                      )}
                      {defaultMethod.marca === Marcas.Mastercard && (
                        <Image src={Mastercard} alt="Mastercard" width={32} height={20} className="w-8 h-auto" />
                      )}
                      {defaultMethod.marca === Marcas.AmericanExpress && (
                        <Image src={AmericanExpress} alt="American Express" width={32} height={20} className="w-8 h-auto" />
                      )}
                      {defaultMethod.marca === Marcas.Discover && (
                        <Image src={Discover} alt="Discover" width={32} height={20} className="w-8 h-auto" />
                      )}
                      {defaultMethod.marca === Marcas.UnionPay && (
                        <Image src={UnionPay} alt="Union Pay" width={32} height={20} className="w-8 h-auto" />
                      )}
                      {defaultMethod.marca === Marcas.Jcb && (
                        <Image src={JCB} alt="JCB" width={32} height={20} className="w-8 h-auto" />
                      )}
                      {defaultMethod.marca === Marcas.DinersClubInternational && (
                        <Image
                          src={DinersClubInternational}
                          alt="Diners Club"
                          width={32}
                          height={20}
                          className="w-8 h-auto"
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {defaultMethod.tipo === "C" ? "Tarjeta de crédito" : "Tarjeta de débito"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        xxxx xxxx xxxx {defaultMethod.ultimos_digitos.toString().slice(-4)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Vence {defaultMethod.fecha_vencimiento.toLocaleString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  {defaultMethod.es_predeterminada && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-accent text-accent-foreground">
                      Predeterminado
                    </span>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button className="ml-2" onClick={() => openMethodModal("C")}>
                    Cambiar / agregar tarjeta
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex gap-4">
          <Link href={idPedido ? `/customer/checkout/envio?id_pedido=${idPedido}` : "/customer/checkout/envio"}>
            <Button variant="outline" className="flex-1 py-3 font-medium">
              Atrás
            </Button>
          </Link>
          <Button
            onClick={handleConfirmOrder}
            disabled={!idPedido || !defaultMethod || isSettingPayment}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-medium"
          >
            Confirmar Pedido
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isMethodModalOpen}
        onClose={() => {
          setIsMethodModalOpen(false)
          resetForm()
        }}
      >
        <h3 className="text-lg font-semibold mb-2">Agregar método de pago</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Completa los datos requeridos para la tarjeta
        </p>
        <form onSubmit={handlePaymentMethodSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <Label className="block text-sm font-medium text-foreground mb-2">Número de tarjeta</Label>
              <Input
                type="text"
                value={ultimos_digitos}
                maxLength={19}
                className="pr-16"
                onChange={(e) => {
                  const raw = e.target.value
                  const digitsOnly = raw.replace(/\D/g, "")

                  const groups = digitsOnly.match(/.{1,4}/g) || []
                  const formatted = groups.join(" ")
                  setUltimosDigitos(formatted)

                  const firstDigit = digitsOnly.charAt(0)
                  const firstTwoDigits = digitsOnly.slice(0, 2)
                  const firstThreeDigits = digitsOnly.slice(0, 3)

                  if (firstDigit === "4") {
                    setMarca(Marcas.Visa)
                  } else if (firstDigit === "5") {
                    setMarca(Marcas.Mastercard)
                  } else if (firstTwoDigits === "34" || firstTwoDigits === "37") {
                    setMarca(Marcas.AmericanExpress)
                  } else if (
                    firstThreeDigits === "604" ||
                    firstThreeDigits === "622" ||
                    firstThreeDigits === "644" ||
                    firstThreeDigits === "645" ||
                    firstThreeDigits === "646" ||
                    firstThreeDigits === "647" ||
                    firstThreeDigits === "648" ||
                    firstThreeDigits === "649" ||
                    firstThreeDigits === "65"
                  ) {
                    setMarca(Marcas.Discover)
                  } else if (firstTwoDigits === "62") {
                    setMarca(Marcas.UnionPay)
                  } else if (
                    firstThreeDigits === "352" ||
                    firstThreeDigits === "353" ||
                    firstThreeDigits === "354" ||
                    firstThreeDigits === "355" ||
                    firstThreeDigits === "356" ||
                    firstThreeDigits === "357" ||
                    firstThreeDigits === "358" ||
                    firstThreeDigits === "359"
                  ) {
                    setMarca(Marcas.Jcb)
                  } else if (
                    firstTwoDigits === "36" ||
                    firstTwoDigits === "38" ||
                    firstThreeDigits === "300" ||
                    firstThreeDigits === "301" ||
                    firstThreeDigits === "302" ||
                    firstThreeDigits === "303" ||
                    firstThreeDigits === "304" ||
                    firstThreeDigits === "305" ||
                    firstThreeDigits === "306" ||
                    firstThreeDigits === "307" ||
                    firstThreeDigits === "308" ||
                    firstThreeDigits === "309"
                  ) {
                    setMarca(Marcas.DinersClubInternational)
                  } else {
                    setMarca("")
                  }
                }}
                placeholder="0000 0000 0000 0000"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2">
                {marca === Marcas.Visa && (
                  <Image src={Visa} alt="Visa" width={32} height={20} className="w-8 h-auto mr-1" />
                )}
                {marca === Marcas.Mastercard && (
                  <Image
                    src={Mastercard}
                    alt="Mastercard"
                    width={32}
                    height={20}
                    className="w-8 h-auto mr-1"
                  />
                )}
                {marca === Marcas.AmericanExpress && (
                  <Image
                    src={AmericanExpress}
                    alt="American Express"
                    width={32}
                    height={20}
                    className="w-8 h-auto mr-1"
                  />
                )}
                {marca === Marcas.Discover && (
                  <Image src={Discover} alt="Discover" width={32} height={20} className="w-8 h-auto mr-1" />
                )}
                {marca === Marcas.UnionPay && (
                  <Image src={UnionPay} alt="Union Pay" width={32} height={20} className="w-8 h-auto mr-1" />
                )}
                {marca === Marcas.Jcb && (
                  <Image src={JCB} alt="JCB" width={32} height={20} className="w-8 h-auto mr-1" />
                )}
                {marca === Marcas.DinersClubInternational && (
                  <Image
                    src={DinersClubInternational}
                    alt="Diners Club"
                    width={32}
                    height={20}
                    className="w-8 h-auto mr-1"
                  />
                )}
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-foreground mb-2">Fecha de vencimiento</Label>
              <Input
                type="text"
                value={fecha_vencimiento}
                onChange={handleFechaVencimientoChange}
                maxLength={5}
                placeholder="MM/AA"
              />

              <Label className="block text-sm font-medium text-foreground mb-2 mt-4">Código de seguridad</Label>
              <Input
                type="text"
                value={codigo_seguridad}
                onChange={(e) => setCodigoSeguridad(e.target.value)}
                maxLength={3}
                placeholder="CVV"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="esPredeterminada"
              type="checkbox"
              checked={es_predeterminado}
              onChange={(e) => setEsPredeterminado(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="esPredeterminada" className="text-sm text-foreground">
              Marcar como método de pago predeterminado
            </Label>
          </div>
          {paymentMethodError && (
            <p className="text-sm text-red-500 mt-1">{paymentMethodError}</p>
          )}
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              className="cursor-pointer"
              onClick={() => {
                setIsMethodModalOpen(false)
                resetForm()
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" className="ml-2 cursor-pointer" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Modal>

      {isErrorPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Pago fallido</h2>
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground hover:underline"
                onClick={() => setIsErrorPaymentModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{errorPaymentMessage}</p>
            {errorSettingPayment && (
              <p className="text-xs text-destructive mb-2">{errorSettingPayment}</p>
            )}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="px-4 py-2"
                onClick={() => setIsErrorPaymentModalOpen(false)}
              >
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
