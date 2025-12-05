"use client"

import { useEffect, useMemo, useState } from "react"
import type { AxiosError } from "axios"

import { useApiClient } from "@/lib/api/useApiClient"
import { makeClientService } from "@/clients/services/client.service"
import type {
  ClientPersonalInfo,
  ClientDirection,
  ClientMethodPayment,
} from "@/clients/schemas/client.schema"

type UseFetchClientsInfoState = {
  personalInfo: ClientPersonalInfo | null
  directions: ClientDirection[]
  paymentMethods: ClientMethodPayment[]
  isLoading: boolean
  error: string | null
}

export function useFetchClientsInfo(): UseFetchClientsInfoState {
  const api = useApiClient()
  const clientService = useMemo(() => makeClientService(api), [api])

  const [personalInfo, setPersonalInfo] = useState<ClientPersonalInfo | null>(null)
  const [directions, setDirections] = useState<ClientDirection[]>([])
  const [paymentMethods, setPaymentMethods] = useState<ClientMethodPayment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchAll = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [info, dirs, methods] = await Promise.all([
          clientService.getPersonalInfo(),
          clientService.getDirections(),
          clientService.getPaymentMethods(),
        ])

        if (cancelled) return

        setPersonalInfo(info)
        setDirections(dirs)
        setPaymentMethods(methods)
      } catch (err) {
        if (cancelled) return

        const axiosErr = err as AxiosError<any>
        const backendMessage = (axiosErr.response as any)?.data?.message;
        const msg = backendMessage || axiosErr.message || "Error al obtener datos del cliente";

        if (backendMessage === "Acceso denegado. Se requiere iniciar sessión"){
          if (typeof window !== "undefined") {
            localStorage.removeItem("user")
            window.location.href = "/auth/login"
          }
          return;
        }

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
  }, [clientService])

  return {
    personalInfo,
    directions,
    paymentMethods,
    isLoading,
    error,
  }
}