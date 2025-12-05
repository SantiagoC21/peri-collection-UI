import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email("El correo electrónico es requerido."),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export type LoginSchema = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
    nombre_usuario: z.string().min(3,{message: "El nombre debe tener al menos 3 caracteres."}),
    email: z.string().email("El correo electrónico es requerido."),
    tipo_doc: z.enum(["DNI", "CE"]),
    documento: z.string().min(8, "El número de documento debe tener al menos 8 caracteres."),
    telefono: z.string().min(8, "El número de teléfono debe tener al menos 8 caracteres."),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
})

export type RegisterSchema = z.infer<typeof RegisterSchema>;

export const RecoverySchema = z.object({
    email: z
      .string()
      .min(1, "El correo es obligatorio")
      .email("Ingresa un correo electrónico válido"),
    nueva_contrasena: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
})

export type RecoverySchema = z.infer<typeof RecoverySchema>;