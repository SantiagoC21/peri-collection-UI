"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useApiClient } from "@/lib/api/useApiClient";
import { makeOrderService } from "@/orders/services/order.service";
import type {
  OrderListItem,
  OrderDetailResponse,
  UpdateOrderStatus,
} from "@/orders/schemas/order.schema";

type UseAdminOrdersState = {
  orders: OrderListItem[];
  isLoading: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
  getOrderDetails: (id: number) => Promise<OrderDetailResponse | null>;
  updateOrderStatus: (
    id: number,
    data: UpdateOrderStatus
  ) => Promise<boolean>;
};

export function useAdminOrders(): UseAdminOrdersState {
  const api = useApiClient();
  const orderService = useMemo(() => makeOrderService(api), [api]);

  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await orderService.getAllOrders();
      // Asegurar que siempre sea un array
      const ordersArray = Array.isArray(data) ? data : [];
      setOrders(ordersArray);
    } catch (err) {
      const e = err as any;
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Error al obtener los pedidos";
      setError(msg);
      console.error("Error fetching orders:", err);
      // En caso de error, establecer array vacío
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [orderService]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getOrderDetails = async (
    id: number
  ): Promise<OrderDetailResponse | null> => {
    try {
      const data = await orderService.getOrderById(id);
      // Log para debugging - remover en producción
      console.log("Order details response:", data);
      return data;
    } catch (err) {
      const e = err as any;
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Error al obtener los detalles del pedido";
      setError(msg);
      console.error("Error fetching order details:", err);
      console.error("Error response data:", e?.response?.data);
      return null;
    }
  };

  const updateOrderStatus = async (
    id: number,
    data: UpdateOrderStatus
  ): Promise<boolean> => {
    try {
      await orderService.updateOrderStatus(id, data);
      // Actualizar el pedido en la lista local
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, estado: data.estado } : order
        )
      );
      return true;
    } catch (err) {
      const e = err as any;
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Error al actualizar el estado";
      setError(msg);
      console.error("Error updating order status:", err);
      return false;
    }
  };

  return {
    orders,
    isLoading,
    error,
    refreshOrders: fetchOrders,
    getOrderDetails,
    updateOrderStatus,
  };
}

