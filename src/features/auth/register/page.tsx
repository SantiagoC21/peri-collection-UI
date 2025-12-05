"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type React from "react"
// Asegúrate de que la ruta sea correcta
import { Input } from '@/components/ui/input';
//import { register as registerService } from "@/features/auth/services/auth.service";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function RegisterPage() {

  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, handleSubmit, errors, isLoading, registerError } = useRegisterForm()



  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Crear Cuenta</h1>
            <p className="text-muted-foreground">Únete a PERI COLLECTION hoy</p>
          </div>

          {registerError && (
            <Alert>
              <AlertTitle>¡Error!</AlertTitle>
              <AlertDescription>{registerError}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="full-name-input" 
                className="block text-sm font-medium text-foreground mb-2">Nombre Completo</label>
              <Input
                type="text"
                id="full-name-input"
                placeholder="Ingresa tu nombre completo"
                {...register("nombre_usuario")}
                disabled={isLoading}
                aria-invalid={!!errors.nombre_usuario}
              />
              {errors.nombre_usuario && (
                <p className="text-red-500 text-xs mt-1">{errors.nombre_usuario.message}</p>
              )}
            </div>
            <div>
              <label 
                htmlFor="email-input" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Correo
              </label>
              <Input
                type="email"
                placeholder="Ingresa un correo"
                id="email-input"
                {...register("email")}
                disabled={isLoading}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label 
                htmlFor="document-input"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Documento
              </label>
              <select 
                id="tipo-documento"
                {...register("tipo_doc")}
                disabled={isLoading}
              >
                <option value="DNI">DNI</option>
                <option value="CE">CE</option>
              </select>
              <Input
                type="text"
                placeholder="Ingresa tu documento de identidad"
                id="document-input"
                {...register("documento")}
                disabled={isLoading}
                aria-invalid={!!errors.documento}
              />
              {errors.documento && (
                <p className="text-red-500 text-xs mt-1">{errors.documento.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="celular-input"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Celular
              </label>
              <Input
                type="tel"
                placeholder="Ingresa tu número de celular"
                id="celular-input"
                {...register("telefono")}
                disabled={isLoading}
                aria-invalid={!!errors.telefono}
              />
              {errors.telefono && (
                <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>
              )}
            </div>
            <div>
              <label   
                htmlFor="password-input" 
                className="block text-sm font-medium text-foreground mb-2"
              >
                Contraseña
              </label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese una contraseña"
                  id="password-input"
                  {...register("password")}
                  disabled={isLoading}
                  className="pr-10"
                  aria-invalid={!!errors.password}
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm-password-input"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme su contraseña"
                  id="confirm-password-input"
                  {...register("confirmPassword")}
                  disabled={isLoading}
                  className="pr-10"
                  aria-invalid={!!errors.confirmPassword}
                />
                <Button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" name="terms" className="rounded border-border mt-1" />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                Acepto los términos y condiciones de PERI COLLECTION
              </label>
            </div>
            {registerError && (
              <p className="text-sm text-red-500">{registerError}</p>
            )}
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-medium" disabled={isLoading}>
              Crear Cuenta
            </Button>
          </form>

          <div className="text-center">
            <p className="text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/auth/login" className="text-accent font-semibold hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

