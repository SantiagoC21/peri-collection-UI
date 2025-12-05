import { z } from "zod";


export const ClothesSchema = z.object({
    id_prenda: z.number(),
    categoria_prendas: z.string(),
    nombre_prenda: z.string(),
    descripcion_prenda: z.string(),
    precio_prenda: z.number(),
    url_imagen: z.string(),
    id_variante: z.number(),
    talla: z.string(),
    color: z.string(),
    sku: z.string(),
    stock_actual: z.number(),
    stock_minimo: z.number(),
    estado: z.enum(["A", "I"]),
    ts_creacion: z.date(),
    ts_actualizacion: z.date()
})

export type Clothes = z.infer<typeof ClothesSchema>

export const ClothesMainCatalogSchema = ClothesSchema.pick({
  id_prenda: true,
  categoria_prendas: true,
  nombre_prenda: true,
  precio_prenda: true,
  url_imagen: true
})

export type ClothesMainCatalog = z.infer<typeof ClothesMainCatalogSchema>

// Detalle de producto para cliente (reutilizando ClothesSchema)
export const ClothesProductStatsSchema = z.object({
  calificacion: z.number(),
  total_reseñas: z.number(),
});

// Parte "producto" del detalle, basada en ClothesSchema
export const ClothesProductDetailProductoSchema = ClothesSchema.pick({
  id_prenda: true,
  categoria_prendas: true,
  nombre_prenda: true,
  descripcion_prenda: true,
  precio_prenda: true,
  url_imagen: true,
}).extend({
  // En el detalle viene como array de strings
  url_imagen: z.array(z.string()),
  stats: ClothesProductStatsSchema,
});

// Variantes del detalle, basada en ClothesSchema
export const ClothesProductVariantSchema = ClothesSchema.pick({
  id_variante: true,
  color: true,
  talla: true,
}).extend({
  stock: z.number(),
});

// Estructura completa de la respuesta formateada del detalle
export const ClothesProductDetailSchema = z.object({
  producto: ClothesProductDetailProductoSchema,
  variantes: z.array(ClothesProductVariantSchema),
});

export type ClothesProductDetail = z.infer<typeof ClothesProductDetailSchema>