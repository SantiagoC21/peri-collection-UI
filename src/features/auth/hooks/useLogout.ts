"use client"

import { useRouter } from "next/navigation"
import { useApiClient } from "@/lib/api/useApiClient"
import { makeAuthService } from "../services/auth.service"

type UseLogoutArgs = {
  setShowLogoutModal: (show: boolean) => void
}

export function useLogout({ setShowLogoutModal }: UseLogoutArgs) {
  const router = useRouter()
  const api = useApiClient()
  const authService = makeAuthService(api)

  const handleLogout = async () => {
    // Usamos este flag como indicador de loading a pantalla completa
    setShowLogoutModal(true)
    try {
      await authService.logoutUser()

      if (typeof window !== "undefined") {
        localStorage.removeItem("user")
      }

      // Redirigir a la página de login de auth
      router.push("/auth/login")
      // No quitamos el loading aquí porque estamos navegando fuera
    } catch (error) {
      console.error("Error al cerrar sesion: ", error)
      setShowLogoutModal(false)
    }
  }

  return {
    handleLogout,
  }
}