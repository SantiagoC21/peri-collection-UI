"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRecoveryForm } from "@/features/auth/hooks/useRecoveryForm"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"

export default function PasswordRecoveryPage() {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    errorMessage,
    successMessage,
  } = useRecoveryForm()

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/customer/login" className="inline-flex items-center gap-2 text-accent hover:text-accent/90 mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver a Iniciar Sesión</span>
        </Link>

        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground mb-2">Recuperar Contraseña</h1>
            <p className="text-muted-foreground">
              Te ayudaremos a recuperar el acceso a tu cuenta
            </p>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}

          {successMessage && (
            <p className="text-sm text-green-600">{successMessage}</p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Correo Electrónico</label>
              <Input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nueva Contraseña</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese una nueva contraseña"
                  {...register("nueva_contrasena")}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.nueva_contrasena && (
                <p className="text-xs text-red-500 mt-1">{errors.nueva_contrasena.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-medium"
            >
              {isLoading ? "Procesando..." : "Restaurar Contraseña"}
            </Button>
          </form>

          {/*}
          {step === "code" && (
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Código de Verificación</label>
                <p className="text-sm text-muted-foreground mb-3">Ingresa el código que enviamos a tu correo</p>
                <Input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              <Button
                type="button"
                onClick={() => setStep("reset")}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-medium"
              >
                Verificar Código
              </Button>
            </form>
          )}
          */}
          {/*
          {step === "reset" && (
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nueva Contraseña</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirmar Contraseña</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-medium">
                Actualizar Contraseña
              </Button>
            </form>
          )}

          */}
        </div>
      </div>
    </div>
  )
}
