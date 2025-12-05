"use client";

import { useState } from "react";
import type { AxiosError } from "axios";

import { useApiClient } from "@/lib/api/useApiClient";
import { makeCarritoService } from "@/clients/services/carrito.service";

export type UseAddToCartState = {
  isLoading: boolean;
  error: string | null;
  success: boolean;
};

export function useAddToCart() {
  const api = useApiClient();
  const carritoService = makeCarritoService(api);

  const [state, setState] = useState<UseAddToCartState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const addToCart = async (params: { id_variante: number; cantidad: number }) => {
    setState({ isLoading: true, error: null, success: false });

    try {
      const res = await carritoService.addDetailCart(params);

      if (res.code !== 200) {
        setState({
          isLoading: false,
          error: res.message || "No se pudo agregar al carrito",
          success: false,
        });
        return;
      }

      setState({ isLoading: false, error: null, success: true });
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      const msg =
        (axiosErr.response as any)?.data?.message ||
        axiosErr.message ||
        "Error al agregar al carrito";

      setState({ isLoading: false, error: msg, success: false });
    }
  };

  return { ...state, addToCart };
}
