"use client"

import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../types/auth.schema";
import { useApiClient } from "@/lib/api/useApiClient";
import { makeAuthService } from "../services/auth.service";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export function useRegisterForm() {
    const router = useRouter()
    const api = useApiClient()
    const auth = useMemo(() => makeAuthService(api), [api])
    const [isLoading, setIsLoading] = useState(false);
    const [registerError, setRegisterError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterSchema>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            tipo_doc: "DNI",
        }
    })

    const onSubmit = async (data: RegisterSchema) => {
        console.log(data)
        setIsLoading(true)
        setRegisterError(null)

        try{
            const response = await auth.registerUser(data)
            console.log(response)
            if ((response as any)?.status === "success") {
                router.push("/customer/login");
            }
        }catch(error){
            console.error("Error capturado durante el registro: ", error)
            if(error instanceof AxiosError){
                const message = (error.response as any)?.data?.message || "Error al registrar"
                setRegisterError(message)
            }else{
                setRegisterError("Error al registrar")
            }
        }finally{
            setIsLoading(false)
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isLoading,
        registerError,
    };
}