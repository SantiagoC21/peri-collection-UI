import { CHECKOUT_ENDPOINTS } from "./endpoints";

import { AxiosInstance } from "axios";

export const makeCheckoutService = (API_CLIENT: AxiosInstance) => ({
    async processCheckout(payload: { id_direccion: number; costo_envio: number }) {
        const response = await API_CLIENT.post<{
            status: string;
            code: number;
            message: string;
            id_pedido: Array<{ procesar_checkout_completo: number }>;
        }>(CHECKOUT_ENDPOINTS.processCheckout, payload);

        const [first] = response.data.id_pedido ?? [];

        return first?.procesar_checkout_completo ?? null;
    },

    async getDetailCheckout(id_pedido: number) {
        const response = await API_CLIENT.get<{ 
            status: string; 
            code: number; 
            message: string; 
            id_pedido: Array<
                {
                    item_nombre: string,
                    item_talla: string,
                    item_color: string,
                    item_imagen: string,
                    item_cantidad: number,
                    item_precio: string,
                    item_subtotal: string,
                    moneda: string,
                    costo_envio: string,
                    impuestos: string,
                    total: string
                }
            > 
        }>(CHECKOUT_ENDPOINTS.getDetailCheckout.replace(":id", id_pedido.toString()));

        return response.data.id_pedido;
    },
    async updateDirection(payload: { id_pedido: number; id_direccion: number }) {
        const response = await API_CLIENT.post<{ 
            status: string; 
            code: number; 
            message: string; 
            exito: boolean
        }>(CHECKOUT_ENDPOINTS.updateDirection, payload);

        return response.data.exito;
    },
    async updateShip(payload: { id_pedido: number; costo_envio: number }) {
        const response = await API_CLIENT.post<{ 
            status: string; 
            code: number; 
            message: string; 
            data: { 
                costo_envio: number,
                total_a_pagar: number
             }
        }>(CHECKOUT_ENDPOINTS.updateShip, payload);

        return response.data.data;
    },
    async validateShip(id_pedido: number) {
        const response = await API_CLIENT.post<{ 
            status: string; 
            code: number; 
            message: string;
            exito: boolean

        }>(CHECKOUT_ENDPOINTS.validateShip.replace(":id", id_pedido.toString()));

        return {
            exito: response.data.exito,
            message: response.data.message,
        };
    },
    async setPayment(payload: { id_pedido: number; id_metodo_pago: number }) {
        const response = await API_CLIENT.post<{ 
            status: string; 
            code: number; 
            message: string;
            transaccion: string

        }>(CHECKOUT_ENDPOINTS.setPayment, payload);

        return {
            transaccion: response.data.transaccion,
            message: response.data.message,
            code: response.data.code,
        };
    },
    async generatePayment(transaccion_id: string) {
        const response = await API_CLIENT.get<{
            status: string;
            code: number;
            message: string;
            data: {
                cabecera: any;
                items: any[];
            };
        }>(CHECKOUT_ENDPOINTS.generatePayment.replace(":id", transaccion_id));

        return response.data.data;
    },
})