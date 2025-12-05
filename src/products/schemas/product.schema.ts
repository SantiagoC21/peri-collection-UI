import { z } from "zod";

// Schema para producto en el catálogo del admin
export const ProductoAdminSchema = z.object({
  id_prenda: z.number(),
  nombre_prenda: z.string(),
  categoria_prenda: z.string(),
  descripcion: z.string().nullable().optional(),
  precio_prenda: z.number(),
  stock_disponible: z.number(),
  sku: z.string().nullable().optional(),
  talla: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  imagen_prenda: z.string().nullable().optional(),
  fecha_creacion: z.string().optional(),
  fecha_actualizacion: z.string().optional(),
});

export type ProductoAdmin = z.infer<typeof ProductoAdminSchema>;

// Schema para crear un nuevo producto
export const CrearProductoSchema = z.object({
  nombre_prenda: z.string().min(1, "El nombre es requerido"),
  categoria_prenda: z.string().min(1, "La categoría es requerida"),
  descripcion: z.string().optional(),
  precio_prenda: z.number().positive("El precio debe ser mayor a 0"),
  stock_disponible: z.number().int().nonnegative("El stock no puede ser negativo").default(0),
  sku: z.string().optional(),
  talla: z.string().optional(),
  color: z.string().optional(),
  imagen_prenda: z.string().url("URL de imagen inválida").optional().or(z.literal("")),
});

export type CrearProducto = z.infer<typeof CrearProductoSchema>;

// Schema para actualizar un producto
export const ActualizarProductoSchema = CrearProductoSchema.partial();

export type ActualizarProducto = z.infer<typeof ActualizarProductoSchema>;

// Schema para resumen de inventario
export const ResumenInventarioSchema = z.object({
  total_productos: z.number(),
  en_stock: z.number(),
  stock_bajo: z.number(),
  agotados: z.number(),
});

export type ResumenInventario = z.infer<typeof ResumenInventarioSchema>;

// Schema para actualizar solo el stock
export const ActualizarStockSchema = z.object({
  stock_disponible: z.number().int().nonnegative(),
});

export type ActualizarStock = z.infer<typeof ActualizarStockSchema>;
