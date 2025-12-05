"use client";

import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";

import { useApiClient } from "@/lib/api/useApiClient";
import { makeClothesService } from "@/clothes/services/clothes.service";
import type { ClothesProductDetail } from "@/clothes/schemas/clothes.schema";

export type UseProductDetailState = {
  product: ClothesProductDetail | null;
  isLoading: boolean;
  error: string | null;
};

export function useProductDetail(id: number | null): UseProductDetailState {
  const api = useApiClient();
  const clothesService = useMemo(() => makeClothesService(api), [api]);

  const [product, setProduct] = useState<ClothesProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const detail = await clothesService.getProductById(id);
        if (cancelled) return;
        setProduct(detail);
      } catch (err) {
        if (cancelled) return;

        const axiosErr = err as AxiosError<any>;
        const msg =
          (axiosErr.response as any)?.data?.message ||
          axiosErr.message ||
          "Error al obtener el producto";
        setError(msg);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id, clothesService]);

  return {
    product,
    isLoading,
    error,
  };
}
