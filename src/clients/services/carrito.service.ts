import { CARRITO_ENDPOINTS } from "./endpoints";

import { AxiosInstance, AxiosError } from "axios";
import { DetailCart } from "../schemas/carrito.schema"


export const makeCarritoService = (API_CLIENT: AxiosInstance) => ({
    async addDetailCart(params: { id_variante: number; cantidad: number }) {
        const response = await API_CLIENT.post<{
            status: string; 
            code: number; 
            message: string; 
        }>(CARRITO_ENDPOINTS.addDetailCart, params);

        

        return {
            status: response.data.status,
            code: response.data.code,
            message: response.data.message,
        };
    },


    async getDetailCart() {
        const response = await API_CLIENT.get<{
                    status: string;
                    code: number;
                    message: string;
                    carrito: Array<{
                        carrito_id: number;
                        detalle_id: number;
                        variante_id: number;
                        stock_actual: number;
                        titulo: string;
                        talla: string;
                        color: string;
                        imagen_url: string;
                        precio_unitario: number | string;
                        cantidad: number;
                        subtotal_item: number | string;
                    }>;
                }>(CARRITO_ENDPOINTS.getCart);

        const items = response.data?.carrito ?? [];

        if (!items.length) {
            return [] as DetailCart[];
        }

        const mapped: DetailCart[] = items.map((item) => ({
            id_detalle: item.detalle_id,
            id_variante: item.variante_id,
            nombre_prenda: item.titulo,
            precio_prenda: typeof item.precio_unitario === "string" ? parseFloat(item.precio_unitario) : item.precio_unitario,
            url_imagen: item.imagen_url,
            talla: item.talla,
            color: item.color,
            stock_actual: item.stock_actual,
            cantidad: item.cantidad,
            subtotal: typeof item.subtotal_item === "string" ? parseFloat(item.subtotal_item) : item.subtotal_item,
        }));

        return mapped;
    },

    async updateQuantityDetailCart(params: { detalleId: number; cantidad: number }) {
        const response = await API_CLIENT.post<{
            status: string;
            code: number;
            message: string;
            data: {
                actualizar_cantidad_item: string;
            };
        }>(CARRITO_ENDPOINTS.updateQuantityDetailCart, {
            id: params.detalleId,
            cantidad: params.cantidad,
        });

        const raw = response.data.data?.actualizar_cantidad_item;
        let updatedItem: { detalleId: number; cantidad: number; subtotal: number } | null = null;

        if (raw) {
            const cleaned = raw.replace(/[()]/g, "");
            const [detalleIdStr, cantidadStr, subtotalStr] = cleaned.split(",");

            updatedItem = {
                detalleId: Number(detalleIdStr),
                cantidad: Number(cantidadStr),
                subtotal: Number(subtotalStr),
            };
        }

        return {
            status: response.data.status,
            code: response.data.code,
            message: response.data.message,
            updatedItem,
        };
    },

    async deleteDetailCart(params: { detalleId: number }) {
        const response = await API_CLIENT.post<{
            status: string;
            code: number;
            message: string;
            data: Array<{
                eliminar_item_carrito: null | string;
            }>;
        }>(CARRITO_ENDPOINTS.deleteDetailCart, {
            id: params.detalleId,
        });

        const [first] = response.data.data ?? [];

        return {
            status: response.data.status,
            code: response.data.code,
            message: response.data.message,
            raw: first?.eliminar_item_carrito ?? null,
        };
    },
    async summaryCart() {
        const response = await API_CLIENT.get<{ status: string; code: number; message: string; data: { subtotal: number; impuesto: number; costo_envio: number; total: number; } }>(CARRITO_ENDPOINTS.summaryCart);

        return {
            subtotal: Number(response.data.data.subtotal),
            impuesto: Number(response.data.data.impuesto),
            costo_envio: Number(response.data.data.costo_envio),
            total: Number(response.data.data.total),
        };
    },
})