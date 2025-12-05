"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, errors, isLoading, loginError } = useLoginForm()


  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Iniciar Sesión</h1>
            <p className="text-muted-foreground">Accede a tu cuenta de PERI</p>
          </div>

          {loginError && (
            <Alert>
              <AlertTitle>¡Error!</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}


          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label 
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Correo Electrónico
              </label>
              <Input
                type="email"
                id="email-input"
                placeholder="Ingresa tu correo electrónico"
                {...register("email")}
                disabled={isLoading}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label 
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  {...register("password")}
                  disabled={isLoading}
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
            </div>
            <div className="flex items-center gap-2 space-y-2">
              <Input type="checkbox" id="remember" className="rounded border-border mt-1" />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Recuérdame
              </label>
            </div>
            <Button 
              type="submit"
              className="w-full 
                         bg-primary text-primary-foreground
                         hover:bg-primary/90 py-3 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando Sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          <div className="text-center space-y-3">
            <Link href="/customer/password-recovery" className="text-accent hover:text-accent/90">
                ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">O</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-3">
              ¿No tienes cuenta?{" "}
              <Link href="/customer/register" className="text-accent font-semibold hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
