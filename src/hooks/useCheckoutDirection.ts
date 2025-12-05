"use client"

import { useMemo, useState } from "react"
import type { AxiosError } from "axios"

import { useApiClient } from "@/lib/api/useApiClient"
import { makeCheckoutService } from "@/clients/services/checkout.service"

export function useUpdateCheckoutDirection() {
  const api = useApiClient()
  const checkoutService = useMemo(() => makeCheckoutService(api), [api])

  const [isUpdatingDirection, setIsUpdatingDirection] = useState(false)
  const [errorUpdatingDirection, setErrorUpdatingDirection] = useState<string | null>(null)

  const updateDirection = async (payload: { id_pedido: number; id_direccion: number }) => {
    setIsUpdatingDirection(true)
    setErrorUpdatingDirection(null)

    try {
      const success = await checkoutService.updateDirection(payload)
      if (!success) {
        setErrorUpdatingDirection("No se pudo actualizar la dirección del pedido")
      }
      return success
    } catch (err) {
      const axiosErr = err as AxiosError<any>
      const msg =
        (axiosErr.response as any)?.data?.message ||
        axiosErr.message ||
        "Error al actualizar la dirección del pedido"
      setErrorUpdatingDirection(msg)
      return false
    } finally {
      setIsUpdatingDirection(false)
    }
  }

  return {
    updateDirection,
    isUpdatingDirection,
    errorUpdatingDirection,
  }
}
