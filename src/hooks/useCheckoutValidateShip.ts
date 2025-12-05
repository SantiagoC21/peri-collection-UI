"use client"

import { useMemo, useState } from "react"
import type { AxiosError } from "axios"

import { useApiClient } from "@/lib/api/useApiClient"
import { makeCheckoutService } from "@/clients/services/checkout.service"

export function useCheckoutValidateShip() {
  const api = useApiClient()
  const checkoutService = useMemo(() => makeCheckoutService(api), [api])

  const [isValidatingShip, setIsValidatingShip] = useState(false)
  const [errorValidatingShip, setErrorValidatingShip] = useState<string | null>(null)

  const validateShip = async (id_pedido: number) => {
    setIsValidatingShip(true)
    setErrorValidatingShip(null)

    try {
      const result = await checkoutService.validateShip(id_pedido)
      return result
    } catch (err) {
      const axiosErr = err as AxiosError<any>
      const msg =
        (axiosErr.response as any)?.data?.message ||
        axiosErr.message ||
        "Error al validar el envío del pedido"
      setErrorValidatingShip(msg)
      return null
    } finally {
      setIsValidatingShip(false)
    }
  }

  return {
    validateShip,
    isValidatingShip,
    errorValidatingShip,
  }
}
