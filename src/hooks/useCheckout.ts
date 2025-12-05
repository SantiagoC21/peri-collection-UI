"use client"

import { useMemo, useState } from "react"
import type { AxiosError } from "axios"

import { useApiClient } from "@/lib/api/useApiClient"
import { makeCheckoutService } from "@/clients/services/checkout.service"

export function useCheckout() {
  const api = useApiClient()
  const checkoutService = useMemo(() => makeCheckoutService(api), [api])

  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processCheckout = async (payload: { id_direccion: number; costo_envio: number }) => {
    setIsProcessing(true)
    setError(null)

    try {
      const idPedido = await checkoutService.processCheckout(payload)
      return idPedido
    } catch (err) {
      const axiosErr = err as AxiosError<any>
      const msg =
        (axiosErr.response as any)?.data?.message ||
        axiosErr.message ||
        "Error al procesar el checkout"
      setError(msg)
      return null
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    processCheckout,
    isProcessing,
    error,
  }
}
