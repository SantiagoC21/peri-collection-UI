import { CLIENT_ENDPOINTS } from "./endpoints";

import { AxiosInstance, AxiosError } from "axios";
import { ClientPersonalInfo, ClientDirection, ClientMethodPayment, ClientOrderRow } from "../schemas/client.schema";



export const makeClientService = (API_CLIENT: AxiosInstance) => ({
    async getPersonalInfo() {
        const response = await API_CLIENT.get<{
            status: string;
            code: number;
            message: string;
            datos_personales: Array<{
                id_usuario: number;
                nombres_completos: string | null;
                apellidos_completos: string | null;
                tipo_documento: "DNI" | "CE";
                numero_documento: string;
                telefono: string;
                email: string;
            }>;
        }>(CLIENT_ENDPOINTS.getPersonalInfo);

        const first = response.data?.datos_personales?.[0];

        if (!first) {
            // Si no hay datos, devolvemos null y dejamos que el hook lo maneje
            return null as unknown as ClientPersonalInfo;
        }

        const mapped: ClientPersonalInfo = {
            nombres_completos: first.nombres_completos ?? "",
            apellidos_completos: first.apellidos_completos ?? "",
            tipo_documento: first.tipo_documento,
            numero_documento: first.numero_documento.trim(),
            telefono: first.telefono,
            email: first.email,
        };

        return mapped;
    },
    async getDirections() {
        try {
            const response = await API_CLIENT.get<{
                status: string;
                code: number;
                message: string;
                direcciones: Array<{
                    id_direccion: number;
                    id_usuario: number;
                    calle: string;
                    departamento: string;
                    provincia: string;
                    distrito: string;
                    pais: string;
                    es_predenterminada: boolean;
                }>;
            }>(CLIENT_ENDPOINTS.getDirections);

            const raw = response.data?.direcciones ?? [];

            const mapped: ClientDirection[] = raw.map((dir) => ({
                id_direccion: dir.id_direccion,
                calle: dir.calle,
                departamento: dir.departamento,
                provincia: dir.provincia,
                distrito: dir.distrito,
                pais: dir.pais,
                es_predeterminada: dir.es_predenterminada,
            }));

            return mapped;
        } catch (error) {
            const axiosErr = error as AxiosError<any>;
            const statusCode = axiosErr.response?.status;
            const backendCode = (axiosErr.response?.data as any)?.code;
            const backendMessage = (axiosErr.response?.data as any)?.message;

            // Caso: el usuario no tiene direcciones aún
            if (statusCode === 404 && backendCode === 404 && backendMessage === "Direcciones no encontradas") {
                return [];
            }

            throw error;
        }
    },
    async getPaymentMethods() {
        try {
            const response = await API_CLIENT.get<{
                status: string;
                code: number;
                message: string;
                metodos_pago: Array<{
                    id_metodo_pago: number;
                    tipo: "C" | "D";
                    marca: string;
                    numero: string;
                    ultimos_digitos: string;
                    fecha_vencimiento: string; // viene como string desde el backend
                    codigo_seguridad: string;
                    estado: string;
                    es_predeterminada: boolean;
                }>;
            }>(CLIENT_ENDPOINTS.getPaymentMethods);

            const raw = (response.data as any)?.metodos_pago ?? [];

            const mapped: ClientMethodPayment[] = raw.map((method: any) => ({
                id_metodo_pago: method.id_metodo_pago,
                tipo: method.tipo,
                marca: method.marca,
                numero: method.numero,
                ultimos_digitos: method.ultimos_digitos,
                fecha_vencimiento: new Date(method.fecha_vencimiento),
                codigo_seguridad: method.codigo_seguridad,
                estado: method.estado,
                es_predeterminada: method.es_predeterminada
                
            }));

            return mapped;
        } catch (error) {
            const axiosErr = error as AxiosError<any>;
            const statusCode = axiosErr.response?.status;
            const backendCode = (axiosErr.response?.data as any)?.code;
            const backendMessage = (axiosErr.response?.data as any)?.message;

            // Caso: el usuario no tiene métodos de pago aún
            if (statusCode === 404 && backendCode === 404 && backendMessage === "Metodos de pago no encontrados") {
                return [];
            }

            throw error;
        }
    },
    async updatePersonalInfo(payload: { nombres_completos: string; apellidos_completos: string }) {
        const response = await API_CLIENT.put<{
            status: string;
            code: number;
            message: string;
        }>(CLIENT_ENDPOINTS.updatePersonalInfo, payload);

        return response.data;
    },
    async updatePhone(payload: { telefono: string }) {
        const response = await API_CLIENT.put<{
            status: string;
            code: number;
            message: string;
        }>(CLIENT_ENDPOINTS.updatePhone, payload);

        return response.data;
    },
    
    async insertDirection(payload: { pais: string; departamento: string; provincia: string; distrito: string; calle: string; es_predeterminada: boolean }) {
        const response = await API_CLIENT.post<{
            status: string;
            code: number;
            message: string;
        }>(CLIENT_ENDPOINTS.insertDirection, payload);

        return response.data;
    },

    async deleteDirection(id_direccion: number) {
        return API_CLIENT.delete(CLIENT_ENDPOINTS.deleteDirection, {
            data: { id_direccion },
        });
    },

    async insertPaymentMethod(payload: { tipo: "C" | "D"; marca: string; ultimos_digitos: string; fecha_vencimiento: string; codigo_seguridad: string; es_predeterminado: boolean }) {
        const response = await API_CLIENT.post<{
            status: string;
            code: number;
            message: string;
        }>(CLIENT_ENDPOINTS.insertPaymentMethod, payload);

        return response.data;
    },

    async deletePaymentMethod(id_metodo_pago: number) {
        return API_CLIENT.delete(CLIENT_ENDPOINTS.deletePaymentMethod, {
            data: { id_metodo_pago },
        });
    },

    async setDefaultAddress(payload: { id_direccion: number }) {
        const response = await API_CLIENT.put<{
            status: string;
            code: number;
            message: string;
        }>(CLIENT_ENDPOINTS.setDefaultAddress, payload);

        return response.data;
    },

    async setDefaultPaymentMethod(payload: { id_metodo_pago: number }) {
        const response = await API_CLIENT.put<{
            status: string;
            code: number;
            message: string;
        }>(CLIENT_ENDPOINTS.setDefaultPaymentMethod, payload);

        return response.data;
    },

    async getOrders() {
        const response = await API_CLIENT.get<{
            status: string;
            code: number;
            message: string;
            data: ClientOrderRow[];
        }>(CLIENT_ENDPOINTS.getOrders);

        return response.data.data ?? [];
    },

})


