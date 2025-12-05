"use client"

import { useEffect, useMemo, useState } from "react"
import type { AxiosError } from "axios"

import { useApiClient } from "@/lib/api/useApiClient"
import { makeCheckoutService } from "@/clients/services/checkout.service"
import { CheckoutItemSchema } from "@/clients/schemas/checkout.schema"

export type CheckoutItem = ReturnType<typeof CheckoutItemSchema.parse>

type UseCheckoutDetailState = {
  items: CheckoutItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  isLoading: boolean
  error: string | null
}

export function useCheckoutDetail(idPedido: number | null): UseCheckoutDetailState {
  const api = useApiClient()
  const checkoutService = useMemo(() => makeCheckoutService(api), [api])

  const [items, setItems] = useState<CheckoutItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!idPedido) return

    let cancelled = false

    const fetchDetail = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const rawItems = await checkoutService.getDetailCheckout(idPedido)
        if (cancelled) return

        const parsed = rawItems.map((it: any) => CheckoutItemSchema.parse(it))
        setItems(parsed)

        if (parsed.length > 0) {
          const first = parsed[0]
          const newSubtotal = parsed.reduce((sum, it) => sum + Number(it.item_subtotal), 0)
          setSubtotal(newSubtotal)
          setShipping(Number(first.pedido_envio))
          setTax(Number(first.pedido_impuestos))
          setTotal(Number(first.pedido_total))
        } else {
          setSubtotal(0)
          setShipping(0)
          setTax(0)
          setTotal(0)
        }
      } catch (err) {
        const axiosErr = err as AxiosError<any>
        const msg =
          (axiosErr.response as any)?.data?.message ||
          axiosErr.message ||
          "Error al obtener el detalle del pedido"
        setError(msg)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchDetail()

    return () => {
      cancelled = true
    }
  }, [checkoutService, idPedido])

  return {
    items,
    subtotal,
    shipping,
    tax,
    total,
    isLoading,
    error,
  }
}
