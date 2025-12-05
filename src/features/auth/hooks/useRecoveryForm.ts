"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { AxiosError } from "axios";

import { useApiClient } from "@/lib/api/useApiClient";
import { makeAuthService } from "../services/auth.service";
import { RecoverySchema, type RecoverySchema as RecoveryFormValues } from "../types/auth.schema";

export function useRecoveryForm() {
  const api = useApiClient();
  const auth = useMemo(() => makeAuthService(api), [api]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoveryFormValues>({
    resolver: zodResolver(RecoverySchema),
  });

  const onSubmit = async (data: RecoveryFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      console.log("Payload enviado a recoverPasswordUser:", {
        email: data.email,
        nueva_contrasena: data.nueva_contrasena,
      });

      const response = await auth.recoverPasswordUser({
        email: data.email,
        nueva_contrasena: data.nueva_contrasena,
      });
      // Asumimos que el backend devuelve { status: "success", message: "..." }
      const status = (response as any)?.status;
      const message = (response as any)?.message;

      if (status === "success") {
        setSuccessMessage(message || "Hemos enviado instrucciones a tu correo");
      } else {
        setErrorMessage(message || "No se pudo iniciar la recuperación de contraseña");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = (error.response as any)?.data?.message || "Error al recuperar la contraseña";
        setErrorMessage(message);
      } else {
        setErrorMessage("Error al recuperar la contraseña");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    errorMessage,
    successMessage,
  };
}

