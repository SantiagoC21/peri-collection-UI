import { z } from "zod";

export const ClientPersonalInfoSchema = z.object({
    nombres_completos: z.string(),
    apellidos_completos: z.string(),
    tipo_documento: z.enum(["DNI","CE"]),
    numero_documento: z.string(),
    telefono: z.string(),
    email: z.string().email()
})

export type ClientPersonalInfo = z.infer<typeof ClientPersonalInfoSchema>

export const ClientDirectionSchema = z.object({
    id_direccion: z.number(),
    calle: z.string(),
    departamento: z.string(),
    provincia: z.string(),
    distrito: z.string(),
    pais: z.string(),
    es_predeterminada: z.boolean()
})

export type ClientDirection = z.infer<typeof ClientDirectionSchema>

export const ClientMethodPaymentSchema = z.object({
    id_metodo_pago: z.number(),
    tipo: z.enum(["C", "D"]),
    marca: z.string(),
    numero: z.string(),
    ultimos_digitos: z.string(),
    fecha_vencimiento: z.date(),
    codigo_seguridad: z.string(),
    estado: z.string(),
    es_predeterminada: z.boolean()
})

export type ClientMethodPayment = z.infer<typeof ClientMethodPaymentSchema>

export const ClientOrderRowSchema = z.object({
    pedido_id: z.number(),
    fecha_compra: z.string(),
    estado_pedido: z.string(),
    total_pedido: z.string(),
    moneda: z.string(),
    codigo_boleta: z.string().nullable(),
    item_nombre: z.string(),
    item_talla: z.string(),
    item_color: z.string(),
    item_cantidad: z.number(),
    item_precio: z.string(),
    item_imagen: z.string(),
})

export type ClientOrderRow = z.infer<typeof ClientOrderRowSchema>