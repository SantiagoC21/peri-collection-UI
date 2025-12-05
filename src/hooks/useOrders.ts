"use client"

import { useEffect, useMemo, useState } from "react"
import type { AxiosError } from "axios"

import { useApiClient } from "@/lib/api/useApiClient"
import { makeClientService } from "@/clients/services/client.service"
import type { ClientOrderRow } from "@/clients/schemas/client.schema"

export type GroupedOrder = {
  pedido_id: number
  fecha_compra: string
  estado_pedido: string
  total_pedido: string
  moneda: string
  codigo_boleta: string | null
  items: ClientOrderRow[]
}

export function useOrders() {
  const api = useApiClient()
  const clientService = useMemo(() => makeClientService(api), [api])

  const [orders, setOrders] = useState<GroupedOrder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchOrders = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const rows = await clientService.getOrders()
        if (cancelled || !rows) return

        const byPedido = new Map<number, GroupedOrder>()

        for (const row of rows) {
          const existing = byPedido.get(row.pedido_id)
          if (!existing) {
            byPedido.set(row.pedido_id, {
              pedido_id: row.pedido_id,
              fecha_compra: row.fecha_compra,
              estado_pedido: row.estado_pedido,
              total_pedido: row.total_pedido,
              moneda: row.moneda,
              codigo_boleta: row.codigo_boleta,
              items: [row],
            })
          } else {
            existing.items.push(row)
          }
        }

        const grouped = Array.from(byPedido.values()).sort((a, b) =>
          new Date(b.fecha_compra).getTime() - new Date(a.fecha_compra).getTime(),
        )

        setOrders(grouped)
      } catch (err) {
        const axiosErr = err as AxiosError<any>
        const msg =
          (axiosErr.response as any)?.data?.message || axiosErr.message || "Error al obtener pedidos"
        if (!cancelled) setError(msg)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchOrders()

    return () => {
      cancelled = true
    }
  }, [clientService])

  return { orders, isLoading, error }
}
