import { z } from "zod";

// Esquema para dirección de envío
export const DireccionEnvioSchema = z.object({
  calle: z.string().optional(),
  ciudad: z.string().optional(),
  distrito: z.string().optional(),
  codigo_postal: z.string().optional(),
  referencia: z.string().optional(),
});

export type DireccionEnvio = z.infer<typeof DireccionEnvioSchema>;

// Esquema para cliente en lista de pedidos
export const OrderListClientSchema = z.object({
  id: z.number(),
  nombre_usuario: z.string(),
  email: z.string().email(),
  telefono: z.string(),
});

export type OrderListClient = z.infer<typeof OrderListClientSchema>;

// Esquema para pedido en lista (GET /admin/pedidos)
export const OrderListItemSchema = z.object({
  id: z.number(),
  cliente: OrderListClientSchema,
  monto_total: z.number(),
  moneda: z.string(),
  estado: z.string(),
  ts_creacion: z.string().or(z.date()),
});

export type OrderListItem = z.infer<typeof OrderListItemSchema>;

// Esquema para item del pedido
export const OrderItemSchema = z.object({
  variante_id: z.number(),
  sku: z.string(),
  talla: z.string(),
  color: z.string(),
  cantidad: z.number(),
  precio_unitario: z.number(),
  subtotal: z.number(),
  nombre_variante: z.string().optional(),
  nombre_prenda: z.string().optional(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

// Esquema para cliente completo en detalles
export const OrderDetailClientSchema = z.object({
  id: z.number(),
  nombre_usuario: z.string(),
  email: z.string().email(),
  telefono: z.string(),
  documento: z.string().optional(), // Puede no venir en la respuesta
});

export type OrderDetailClient = z.infer<typeof OrderDetailClientSchema>;

// Esquema para pedido completo en detalles
export const OrderDetailSchema = z.object({
  id: z.number(),
  estado: z.string(),
  ts_creacion: z.string().or(z.date()),
  moneda: z.string(),
  monto_total: z.number(),
  direccion_envio_json: DireccionEnvioSchema.or(z.string()).optional(),
  impuestos: z.number().optional(),
  descuento: z.number().optional(),
  costo_envio: z.number().optional(),
});

export type OrderDetail = z.infer<typeof OrderDetailSchema>;

// Esquema para respuesta completa de detalles
export const OrderDetailResponseSchema = z.object({
  pedido: OrderDetailSchema,
  cliente: OrderDetailClientSchema,
  items: z.array(OrderItemSchema),
});

export type OrderDetailResponse = z.infer<typeof OrderDetailResponseSchema>;

// Esquema para actualizar estado
export const UpdateOrderStatusSchema = z.object({
  estado: z.string(),
});

export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusSchema>;

