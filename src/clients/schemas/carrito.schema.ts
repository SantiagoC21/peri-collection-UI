import { z } from "zod";
import { ClothesSchema } from "../../clothes/schemas/clothes.schema";

export const detailProductCartSchema = ClothesSchema.pick({
    id_variante: true,
    nombre_prenda: true,
    precio_prenda: true,
    url_imagen: true,
    talla: true,
    color: true,
    stock_actual: true
});

export type DetailProductCart = z.infer<typeof detailProductCartSchema> 

export const detailCartSchema = detailProductCartSchema.extend({
    id_detalle: z.number(),
    cantidad: z.number(),
    subtotal: z.number()
});

export type DetailCart = z.infer<typeof detailCartSchema>