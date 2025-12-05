"use client"

import { useEffect, useMemo, useState } from "react"
import type { AxiosError } from "axios"

import { useApiClient } from "@/lib/api/useApiClient"
import { makeCarritoService } from "@/clients/services/carrito.service"
import type { DetailCart } from "@/clients/schemas/carrito.schema"

type UseFetchDetailCartState = {
  items: DetailCart[]
  isLoading: boolean
  error: string | null
  setItems: (value: DetailCart[] | ((prev: DetailCart[]) => DetailCart[])) => void
}

export function useFetchDetailCart(): UseFetchDetailCartState {
  const api = useApiClient()
  const carritoService = useMemo(() => makeCarritoService(api), [api])

  const [items, setItems] = useState<DetailCart[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchAll = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const detailCartItems = await carritoService.getDetailCart()

        if (cancelled) return

        setItems(detailCartItems)
      } catch (err) {
        if (cancelled) return

        const axiosErr = err as AxiosError<any>
        const msg =
          (axiosErr.response as any)?.data?.message ||
          axiosErr.message ||
          "Error al obtener el carrito"
        setError(msg)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchAll()

    return () => {
      cancelled = true
    }
  }, [carritoService])

  return {
    items,
    isLoading,
    error,
    setItems,
  }
}

export function useUpdateQuantityDetailCart() {
  const api = useApiClient()
  const carritoService = useMemo(() => makeCarritoService(api), [api])
  const [detailToUpdate, setDetailToUpdate] = useState<{ detalleId: number; cantidad: number } | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateQuantity = async (detalleId: number, cantidad: number) => {
    setIsUpdating(true)
    setError(null)
    setDetailToUpdate({ detalleId, cantidad })

    try {
      const result = await carritoService.updateQuantityDetailCart({ detalleId, cantidad })

      if (result.code !== 200) {
        throw new Error(result.message || "Error al actualizar la cantidad del carrito")
      }

      return result.updatedItem
    } catch (err) {
      const axiosErr = err as AxiosError<any>
      const msg =
        (axiosErr.response as any)?.data?.message ||
        axiosErr.message ||
        "Error al actualizar la cantidad del carrito"
      setError(msg)
      return null
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    updateQuantity,
    detailToUpdate,
    isUpdating,
    error,
  }
}

export function useDeleteDetailCart() {
  const api = useApiClient()
  const carritoService = useMemo(() => makeCarritoService(api), [api])
  const [detailToDelete, setDetailToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteItem = async (detalleId: number) => {
    setIsDeleting(true)
    setError(null)
    setDetailToDelete(detalleId)

    try {
      const result = await carritoService.deleteDetailCart({ detalleId })

      if (result.code !== 200) {
        throw new Error(result.message || "Error al eliminar el item del carrito")
      }

      return true
    } catch (err) {
      const axiosErr = err as AxiosError<any>
      const msg =
        (axiosErr.response as any)?.data?.message ||
        axiosErr.message ||
        "Error al eliminar el item del carrito"
      setError(msg)
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    deleteItem,
    detailToDelete,
    isDeleting,
    error,
  }
}

type CartSummary = {
  subtotal: number
  impuesto: number
  costo_envio: number
  total: number
}

export function useSummaryCart() {
  const api = useApiClient()
  const carritoService = useMemo(() => makeCarritoService(api), [api])

  const [summary, setSummary] = useState<CartSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetchSummary = async () => {
    try {
      setIsLoading(true)
      const result = await carritoService.summaryCart()
      setSummary(result)
      setError(null)
    } catch (err) {
      const axiosErr = err as AxiosError<any>
      const msg =
        (axiosErr.response as any)?.data?.message ||
        axiosErr.message ||
        "Error al obtener el resumen del carrito"
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    const fetchSummary = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await carritoService.summaryCart()
        if (cancelled) return
        setSummary(result)
      } catch (err) {
        if (cancelled) return

        const axiosErr = err as AxiosError<any>
        const msg =
          (axiosErr.response as any)?.data?.message ||
          axiosErr.message ||
          "Error al obtener el resumen del carrito"
        setError(msg)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    refetchSummary()

    return () => {
      cancelled = true
    }
  }, [carritoService])

  return { summary, isLoading, error, refetchSummary }
}