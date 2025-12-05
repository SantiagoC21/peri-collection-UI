"use client";

import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";

import { useApiClient } from "@/lib/api/useApiClient";
import { makeClothesService } from "@/clothes/services/clothes.service";
import type { ClothesMainCatalog } from "@/clothes/schemas/clothes.schema";

type UseFetchProductsState = {
  products: ClothesMainCatalog[];
  isLoading: boolean;
  error: string | null;
};

export function useFetchProducts(): UseFetchProductsState {
  const api = useApiClient();
  const clothesService = useMemo(() => makeClothesService(api), [api]);

  const [products, setProducts] = useState<ClothesMainCatalog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const catalog = await clothesService.getMainCatalog();
        if (cancelled) return;
        console.log("Productos recibidos en useFetchProducts:", catalog);
        setProducts(catalog);
      } catch (err) {
        if (cancelled) return;

        const axiosErr = err as AxiosError<any>;
        const msg =
          (axiosErr.response as any)?.data?.message ||
          axiosErr.message ||
          "Error al obtener el catálogo";
        setError(msg);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [clothesService]);

  return {
    products,
    isLoading,
    error,
  };
}

