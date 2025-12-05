"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { LogOut, Edit2, Package, RotateCcw, MapPinHouse, CreditCard, Loader2 } from "lucide-react"
import { useLogout } from "@/features/auth/hooks/useLogout"

type User = {
  nombre_usuario?: string
  email?: string
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const { handleLogout } = useLogout({ setShowLogoutModal })

  useEffect(() => {
    if (typeof window === "undefined") return

    const stored = localStorage.getItem("user")

    if (!stored) {
      // Si no hay sesión guardada, enviar al login de auth
      router.push("/auth/login")
      return
    }

    try {
      const parsed = JSON.parse(stored)
      setUser(parsed)
    } catch {
      // Si algo falla al parsear, limpiamos y redirigimos al login
      localStorage.removeItem("user")
      setUser(null)
      router.push("/auth/login")
    }
  }, [router])

  const isActive = (path: string) => pathname === path

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-foreground">Mi Cuenta</h1>
        <Button
          variant="outline"
          className="gap-2 bg-transparent"
          onClick={() => {
            // Si en el futuro quieres un modal, aquí puedes hacer setShowLogoutModal(true)
            handleLogout()
          }}
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </Button>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center gap-3 bg-card px-6 py-4 rounded-lg shadow-lg">
            <Loader2 className="h-6 w-6 animate-spin text-foreground" />
            <p className="text-sm text-muted-foreground">Cerrando sesión...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="border border-border rounded-xl p-6 bg-card">
            <div className="mb-6">
              <div className="w-16 h-16 bg-secondary rounded-full mb-4"></div>
              <h2 className="font-semibold text-foreground">
                Hola{user?.nombre_usuario ? `, ${user.nombre_usuario}` : "!"}
              </h2>
            </div>
            <nav className="space-y-2">
              
              <Link href="/customer/account/personalInfo">
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    isActive("/customer/account/personalInfo")
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <Edit2 className="w-4 h-4 inline mr-2" />
                  Perfil
                </button>
              </Link>

              <Link href="/customer/account/directions">
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    isActive("/customer/account/directions")
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <MapPinHouse className="w-4 h-4 inline mr-2" />
                  Direcciones
                </button>
              </Link>

              <Link href="/customer/account/paymentMethods">
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    isActive("/customer/account/paymentMethods")
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Metodos de Pago
                </button>
              </Link>

              
              
              <Link href="/customer/account/orders">
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    isActive("/customer/account/orders")
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <Package className="w-4 h-4 inline mr-2" />
                  Mis Pedidos
                </button>
              </Link>
              <Link href="/customer/account/returns">
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    isActive("/customer/account/returns")
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Devoluciones
                </button>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  )
}
