import { ORDER_ENDPOINTS } from "./endpoints";
import type {
  OrderListItem,
  OrderDetailResponse,
  UpdateOrderStatus,
} from "../schemas/order.schema";
import type { AxiosInstance } from "axios";

export const makeOrderService = (api: AxiosInstance) => ({
  /**
   * Obtener todos los pedidos
   */
  async getAllOrders(): Promise<OrderListItem[]> {
    const response = await api.get<
      OrderListItem[] | {
        status: string;
        code: number;
        message: string;
        pedidos: OrderListItem[];
      }
    >(ORDER_ENDPOINTS.getAllOrders);

    // Manejar ambos casos: array directo o objeto envuelto
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Si es un objeto con estructura estándar
    if (response.data && typeof response.data === "object" && "pedidos" in response.data) {
      return response.data.pedidos;
    }

    // Fallback: retornar array vacío si no se puede parsear
    return [];
  },

  /**
   * Obtener un pedido por ID con detalles completos
   */
  async getOrderById(id: number): Promise<OrderDetailResponse> {
    const response = await api.get<any>(ORDER_ENDPOINTS.getOrderById(id));

    if (!response.data) {
      throw new Error("Pedido no encontrado");
    }

    const data = response.data;

    // Estructura real del backend:
    // { status, code, message, pedido: { id, cliente: {...}, productos: [...] } }
    if (data.pedido) {
      const pedidoData = data.pedido;
      
      // Mapear productos a items y normalizar estructura
      const items = Array.isArray(pedidoData.productos)
        ? pedidoData.productos.map((prod: any) => ({
            variante_id: prod.variante_id,
            sku: prod.sku,
            talla: prod.talla?.trim() || "",
            color: prod.color,
            cantidad: prod.cantidad,
            precio_unitario: prod.precio_unitario,
            subtotal: prod.subtotal,
            nombre_variante: prod.nombre_producto,
            nombre_prenda: prod.nombre_producto,
          }))
        : [];

      // Normalizar el pedido
      const pedido = {
        id: pedidoData.id,
        estado: pedidoData.estado,
        ts_creacion: pedidoData.fecha_creacion || pedidoData.ts_creacion,
        moneda: pedidoData.moneda || "PEN",
        monto_total: pedidoData.monto_total,
        direccion_envio_json: pedidoData.direccion_envio || pedidoData.direccion_envio_json,
        impuestos: pedidoData.impuestos,
        descuento: pedidoData.descuento,
        costo_envio: pedidoData.costo_envio,
      };

      // El cliente está dentro de pedido
      const cliente = pedidoData.cliente
        ? {
            id: pedidoData.cliente.id,
            nombre_usuario: pedidoData.cliente.nombre_usuario,
            email: pedidoData.cliente.email,
            telefono: pedidoData.cliente.telefono,
            documento: pedidoData.cliente.documento || "", // Puede no venir
          }
        : null;

      if (!cliente) {
        throw new Error("Datos del cliente no encontrados en la respuesta");
      }

      return {
        pedido,
        cliente,
        items,
      } as OrderDetailResponse;
    }

    // Si llegamos aquí, la estructura no es reconocida
    console.error("Estructura de respuesta no reconocida:", data);
    throw new Error(`Estructura de respuesta inválida. Datos recibidos: ${JSON.stringify(data)}`);
  },

  /**
   * Actualizar estado del pedido
   */
  async updateOrderStatus(
    id: number,
    data: UpdateOrderStatus
  ): Promise<{ message: string; estado: string }> {
    const response = await api.patch<{ message: string; estado: string }>(
      ORDER_ENDPOINTS.updateOrderStatus(id),
      data
    );

    return response.data;
  },
});

