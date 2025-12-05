"use client"

import { useMemo, useState } from "react"
import type { AxiosError } from "axios"

import { useApiClient } from "@/lib/api/useApiClient"
import { makeCheckoutService } from "@/clients/services/checkout.service"

export function useUpdateCheckoutShip() {
  const api = useApiClient()
  const checkoutService = useMemo(() => makeCheckoutService(api), [api])

  const [isUpdatingShip, setIsUpdatingShip] = useState(false)
  const [errorUpdatingShip, setErrorUpdatingShip] = useState<string | null>(null)

  const updateShip = async (payload: { id_pedido: number; costo_envio: number }) => {
    setIsUpdatingShip(true)
    setErrorUpdatingShip(null)

    try {
      const data = await checkoutService.updateShip(payload)
      return data
    } catch (err) {
      const axiosErr = err as AxiosError<any>
      const msg =
        (axiosErr.response as any)?.data?.message ||
        axiosErr.message ||
        "Error al actualizar el envío del pedido"
      setErrorUpdatingShip(msg)
      return null
    } finally {
      setIsUpdatingShip(false)
    }
  }

  return {
    updateShip,
    isUpdatingShip,
    errorUpdatingShip,
  }
}
