"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useCheckoutDetail } from "@/hooks/useCheckoutDetail"
import Boleta, { BoletaData } from "@/components/boleta/Boleta"
import { useApiClient } from "@/lib/api/useApiClient"
import { makeCheckoutService } from "@/clients/services/checkout.service"
import type { AxiosError } from "axios"

export default function CheckoutConfirmacionPage() {
  const searchParams = useSearchParams()
  const idPedidoParam = searchParams.get("id_pedido")
  const idPedido = idPedidoParam ? Number(idPedidoParam) : null
  const transaccion = searchParams.get("transaccion")

  const {
    items,
    subtotal,
    shipping,
    tax,
    total,
    isLoading,
    error,
  } = useCheckoutDetail(idPedido)

  const boletaRef = useRef<HTMLDivElement | null>(null)
  const [boletaData, setBoletaData] = useState<BoletaData | null>(null)
  const [boletaError, setBoletaError] = useState<string | null>(null)
  const [isLoadingBoleta, setIsLoadingBoleta] = useState(false)

  const api = useApiClient()
  const checkoutService = useMemo(() => makeCheckoutService(api), [api])

  useEffect(() => {
    if (!transaccion) return

    let cancelled = false

    const fetchBoleta = async () => {
      setIsLoadingBoleta(true)
      setBoletaError(null)

      try {
        const data = await checkoutService.generatePayment(transaccion)
        if (cancelled || !data) return

        const { cabecera, items } = data as any

        const mapped: BoletaData = {
          cabecera: {
            empresa: {
              nombre: cabecera.empresa.nombre,
              direccion: cabecera.empresa.direccion,
              ruc: cabecera.empresa.ruc,
            },
            cliente: {
              nombre: cabecera.cliente.nombre,
              documento: cabecera.cliente.documento,
              direccion: {
                calle: cabecera.cliente.direccion.calle,
                distrito: cabecera.cliente.direccion.distrito,
                provincia: cabecera.cliente.direccion.provincia,
                departamento: cabecera.cliente.direccion.departamento,
              },
            },
            comprobante: {
              tipo: cabecera.comprobante.tipo,
              serie: cabecera.comprobante.serie,
              numero: cabecera.comprobante.numero,
              fecha: cabecera.comprobante.fecha,
            },
            pago: {
              metodo: cabecera.pago.metodo,
              gravada: cabecera.pago.gravada,
              igv: cabecera.pago.igv,
              total: cabecera.pago.total,
            },
          },
          items: (items || []).map((item: any) => ({
            cantidad: item.cantidad,
            descripcion: item.descripcion,
            precio_unit: item.precio_unit,
            subtotal: item.subtotal,
          })),
        }

        setBoletaData(mapped)
      } catch (err) {
        const axiosErr = err as AxiosError<any>
        const msg =
          (axiosErr.response as any)?.data?.message ||
          axiosErr.message ||
          "Error al generar la boleta"
        if (!cancelled) {
          setBoletaError(msg)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingBoleta(false)
        }
      }
    }

    fetchBoleta()

    return () => {
      cancelled = true
    }
  }, [checkoutService, transaccion])

  const handleViewBoleta = () => {
    if (!boletaData) return
    window.print()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-foreground mb-8">Checkout - Confirmación</h1>

      <div className="flex gap-4 mb-12">
        {["Envío", "Pago", "Confirmación"].map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                index === 2
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

      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-accent" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">¡Pedido Confirmado!</h2>
          <p className="text-muted-foreground mb-4">Tu pedido ha sido registrado correctamente.</p>
        </div>

        <div className="bg-secondary rounded-xl p-6 text-left">
          <h3 className="font-semibold text-foreground mb-4">Resumen del Pedido</h3>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Cargando resumen...</div>
          ) : error ? (
            <div className="text-sm text-destructive">{error}</div>
          ) : items.length === 0 ? (
            <div className="text-sm text-muted-foreground">No se encontró información del pedido.</div>
          ) : (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Subtotal: S/ {subtotal.toFixed(2)}</p>
              <p>Envío: S/ {shipping.toFixed(2)}</p>
              <p>Impuestos: S/ {tax.toFixed(2)}</p>
              <p className="font-semibold text-foreground border-t border-border pt-2">Total: S/ {total.toFixed(2)}</p>
            </div>
          )}

          {isLoadingBoleta && (
            <div className="mt-2 text-xs text-muted-foreground">Generando boleta...</div>
          )}
          {boletaError && (
            <div className="mt-2 text-xs text-destructive">{boletaError}</div>
          )}
        </div>

        {/* Boleta visible para impresión (window.print) */}
        <div ref={boletaRef} className="mt-8">
          <Boleta data={boletaData} />
        </div>

        <div className="space-y-3">
          <Link href="/customer/account/orders">
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
    </div>
  )
}
