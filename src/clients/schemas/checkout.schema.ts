import { z } from "zod";
import { ClientDirectionSchema } from "./client.schema";

export const PedidoSchema = z.object({
    id_pedido: z.number(),
    carrito_id: z.number(),
    cleinte_id: z.number(),
    descripcion_pedido: z.string(),
    monto_pedido: z.number(),
    estado_pedido: z.enum(["pendiente","pagado","enviado", "entregado","cancelado","reembolsado"]),
    moneda: z.enum(["USD", "PEN"]),
    impuestos: z.number(),
    descuento: z.number(),
    costo_envio: z.number(),
    direccion: ClientDirectionSchema,
});

export type Pedido = z.infer<typeof PedidoSchema>

export const DetailPedidoSchema = z.object({
    id_detail_pedido: z.number(),
    pedido_id: z.number(),
    variante_id: z.number(),
    cantidad: z.number(),
    precio_unitario: z.number(),
    subtotal: z.number(),
})

export type DetailPedido = z.infer<typeof DetailPedidoSchema>

export const CheckoutItemSchema = z.object({
    item_nombre: z.string(),
    item_talla: z.string(),
    item_color: z.string(),
    item_imagen: z.string(),
    item_cantidad: z.number(),
    item_precio: z.string(),
    item_subtotal: z.string(),
    pedido_moneda: z.string(),
    pedido_envio: z.string(),
    pedido_impuestos: z.string(),
    pedido_total: z.string(),
});