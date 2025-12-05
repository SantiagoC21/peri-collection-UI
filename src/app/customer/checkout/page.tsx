"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, SquarePen } from "lucide-react"
import { useFetchClientsInfo } from "@/hooks/useFetchClients"
import { useCheckoutDetail } from "@/hooks/useCheckoutDetail"
import { useUpdateCheckoutDirection } from "@/hooks/useCheckoutDirection"
import { useUpdateCheckoutShip } from "@/hooks/useCheckoutShip"
import { useCheckoutValidateShip } from "@/hooks/useCheckoutValidateShip"

export default function CheckoutPage() {
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [selectedDirectionId, setSelectedDirectionId] = useState<number | null>(null)
  const [modalSelectedDirectionId, setModalSelectedDirectionId] = useState<number | null>(null)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState<string>("")

  const searchParams = useSearchParams()
  const idPedidoParam = searchParams.get("id_pedido")
  const idPedido = idPedidoParam ? Number(idPedidoParam) : null

  const { directions } = useFetchClientsInfo()
  const {
    items,
    subtotal,
    shipping,
    tax,
    total,
    isLoading,
    error,
  } = useCheckoutDetail(idPedido)

  const {
    updateDirection,
    isUpdatingDirection,
    errorUpdatingDirection,
  } = useUpdateCheckoutDirection()

  const {
    updateShip,
    isUpdatingShip,
    errorUpdatingShip,
  } = useUpdateCheckoutShip()

  const {
    validateShip,
    isValidatingShip,
    errorValidatingShip,
  } = useCheckoutValidateShip()

  const [selectedShipping, setSelectedShipping] = useState<"standard" | "express">("standard")
  const [shippingOverride, setShippingOverride] = useState<number | null>(null)
  const [totalOverride, setTotalOverride] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    if (step === "payment") setStep("confirmation")
  }

  const handleContinueToPayment = async () => {
    if (!idPedido) return

    const result = await validateShip(idPedido)
    if (!result) return

    if (result.exito) {
      setStep("payment")
    } else {
      const backendMessage = result.message || "Error al continuar al pago"
      setErrorModalMessage(backendMessage)
      setIsErrorModalOpen(true)
    }
  }

  const getDefaultDirection = () =>
    directions.find((d) => d.es_predeterminada) ?? directions[0]

  const currentDirection =
    directions.find((d) => d.id_direccion === selectedDirectionId) ?? getDefaultDirection()

  const effectiveShipping = shippingOverride ?? shipping
  const effectiveTotal = totalOverride ?? total

  // Ajustar la opción seleccionada según el costo de envío actual
  useEffect(() => {
    if (isLoading) return
    // Sólo inicializar si no hay override manual aún
    if (shippingOverride !== null) return

    if (shipping === 60) {
      setSelectedShipping("express")
    } else {
      // Por defecto, cualquier otro valor se considera estándar
      setSelectedShipping("standard")
    }
  }, [isLoading, shipping, shippingOverride])

  const handleShippingChange = async (type: "standard" | "express") => {
    if (!idPedido) return

    setSelectedShipping(type)

    const costo_envio = type === "standard" ? 30 : 60

    const data = await updateShip({ id_pedido: idPedido, costo_envio })

    if (data) {
      setShippingOverride(data.costo_envio)
      setTotalOverride(data.total_a_pagar)
      if (typeof window !== "undefined") {
        window.location.reload()
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex gap-4 mb-12">
        {["Envío", "Pago", "Confirmación"].map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                index === 0 && step === "shipping"
                  ? "bg-accent text-accent-foreground"
                  : index === 1 && (step === "payment" || step === "confirmation")
                    ? "bg-accent text-accent-foreground"
                    : index === 2 && step === "confirmation"
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

      {/* Shipping Step */}
      {step === "shipping" && (
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
                      <span>S/ {effectiveShipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Impuesto (18%)</span>
                      <span>S/ {tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>S/ {effectiveTotal.toFixed(2)}</span>
                  </div>
                </>
              )}

      {isErrorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Error al continuar al pago</h2>
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground hover:underline"
                onClick={() => setIsErrorModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{errorModalMessage}</p>
            {errorValidatingShip && (
              <p className="text-xs text-destructive mb-2">{errorValidatingShip}</p>
            )}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="px-4 py-2"
                onClick={() => setIsErrorModalOpen(false)}
              >
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}
            </div>

            {/* Información de Envío a la derecha */}
            <div className="lg:col-span-2 border border-border rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Información de Envío</h2>
              <div className="space-y-4">
                <div className="bg-secondary rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground">Dirección de entrega</h3>
                    {directions.length > 0 && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                        onClick={() => {
                          const base = currentDirection ?? getDefaultDirection()
                          setModalSelectedDirectionId(base ? base.id_direccion : null)
                          setIsAddressModalOpen(true)
                        }}
                      >
                        <SquarePen className="w-4 h-4" />
                        Cambiar
                      </button>
                    )}
                  </div>

                  {currentDirection ? (
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="text-foreground font-medium">
                        {currentDirection.calle}
                      </p>
                      <p>
                        {currentDirection.distrito}, {currentDirection.provincia}, {currentDirection.departamento}
                      </p>
                      <p>{currentDirection.pais}</p>
                      {currentDirection.es_predeterminada && (
                        <span className="inline-flex mt-2 px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">
                          Predeterminada
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No tienes una dirección registrada. Agrega una en tu cuenta para poder realizar el envío.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 p-4 bg-secondary rounded-lg">
                <h3 className="font-semibold text-foreground mb-3">Opciones de Envío</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      className="rounded-full"
                      checked={selectedShipping === "standard"}
                      disabled={isUpdatingShip}
                      onChange={() => handleShippingChange("standard")}
                    />
                    <span className="text-sm text-foreground">Envío Estándar (2-3 días) - S/ 30</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      className="rounded-full"
                      checked={selectedShipping === "express"}
                      disabled={isUpdatingShip}
                      onChange={() => handleShippingChange("express")}
                    />
                    <span className="text-sm text-foreground">Envío Express (1 día) - S/ 60</span>
                  </label>
                </div>
                {isUpdatingShip && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-3 h-3 border-2 border-border border-t-primary rounded-full animate-spin" />
                    <span>Actualizando costo de envío...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handleContinueToPayment}
            disabled={!idPedido || isValidatingShip}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-medium"
          >
            Continuar al Pago
          </Button>
        </div>
      )}

      {/* Payment Step */}
      {step === "payment" && (
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Información de Pago</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nombre en la Tarjeta</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="Juan Pérez"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Número de Tarjeta</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Fecha de Vencimiento</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep("shipping")} className="flex-1 py-3 font-medium">
              Atrás
            </Button>
            <Button
              onClick={handleNextStep}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-medium"
            >
              Confirmar Pedido
            </Button>
          </div>
        </div>
      )}

      {/* Modal de selección de dirección */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Seleccionar dirección</h2>
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground hover:underline"
                onClick={() => setIsAddressModalOpen(false)}
              >
                Cerrar
              </button>
            </div>

            {directions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tienes direcciones registradas. Agrega una en tu cuenta para poder seleccionarla.
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {directions.map((dir) => (
                  <label
                    key={dir.id_direccion}
                    className="flex items-start gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/60"
                  >
                    <input
                      type="radio"
                      name="selectedDirection"
                      className="mt-1"
                      checked={modalSelectedDirectionId === dir.id_direccion}
                      onChange={() => setModalSelectedDirectionId(dir.id_direccion)}
                    />
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="text-foreground font-medium">{dir.calle}</p>
                      <p>
                        {dir.distrito}, {dir.provincia}, {dir.departamento}
                      </p>
                      <p>{dir.pais}</p>
                      {dir.es_predeterminada && (
                        <span className="inline-flex mt-1 px-2 py-1 text-xs rounded-full bg-accent text-accent-foreground">
                          Predeterminada
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                className="px-4 py-2"
                onClick={() => setIsAddressModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!modalSelectedDirectionId || !idPedido || isUpdatingDirection}
                onClick={async () => {
                  if (!modalSelectedDirectionId || !idPedido) return

                  const success = await updateDirection({
                    id_pedido: idPedido,
                    id_direccion: modalSelectedDirectionId,
                  })

                  if (success) {
                    setSelectedDirectionId(modalSelectedDirectionId)
                    setIsAddressModalOpen(false)
                  }
                }}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Step */}
      {step === "confirmation" && (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-20 h-20 text-accent" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">¡Pedido Confirmado!</h2>
            <p className="text-muted-foreground mb-4">Número de Pedido: #PER-2025-001234</p>
            <p className="text-muted-foreground">Te hemos enviado un correo de confirmación a {formData.email}</p>
          </div>
          <div className="bg-secondary rounded-xl p-6 text-left">
            <h3 className="font-semibold text-foreground mb-4">Resumen del Pedido</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Subtotal: S/ 698.00</p>
              <p>Envío: S/ 30.00</p>
              <p>Impuesto: S/ 130.64</p>
              <p className="font-semibold text-foreground border-t border-border pt-2">Total: S/ 858.64</p>
            </div>
          </div>
          <div className="space-y-3">
            <Link href="/customer/account">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-medium">
                Ver Mis Pedidos
              </Button>
            </Link>
            <Link href="/customer/catalog">
              <Button variant="outline" className="w-full py-3 font-medium bg-transparent">
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
