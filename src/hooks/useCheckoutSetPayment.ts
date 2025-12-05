"use client"

import { useMemo, useState } from "react"
import type { AxiosError } from "axios"

import { useApiClient } from "@/lib/api/useApiClient"
import { makeCheckoutService } from "@/clients/services/checkout.service"

export function useCheckoutSetPayment() {
  const api = useApiClient()
  const checkoutService = useMemo(() => makeCheckoutService(api), [api])

  const [isSettingPayment, setIsSettingPayment] = useState(false)
  const [errorSettingPayment, setErrorSettingPayment] = useState<string | null>(null)

  const setPayment = async (payload: { id_pedido: number; id_metodo_pago: number }) => {
    setIsSettingPayment(true)
    setErrorSettingPayment(null)

    try {
      const result = await checkoutService.setPayment(payload)
      return result
    } catch (err) {
      const axiosErr = err as AxiosError<any>
      const msg =
        (axiosErr.response as any)?.data?.message ||
        axiosErr.message ||
        "Error al procesar el pago"
      setErrorSettingPayment(msg)
      return null
    } finally {
      setIsSettingPayment(false)
    }
  }

  return {
    setPayment,
    isSettingPayment,
    errorSettingPayment,
  }
}
