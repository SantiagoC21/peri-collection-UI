"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useApiClient } from "@/lib/api/useApiClient";
import { makeProductService } from "@/products/services/product.service";
import type {
  ProductoAdmin,
  CrearProducto,
  ActualizarProducto,
  ResumenInventario,
} from "@/products/schemas/product.schema";

type UseAdminProductsState = {
  products: ProductoAdmin[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  createProduct: (data: CrearProducto) => Promise<ProductoAdmin | null>;
  updateProduct: (id: number, data: ActualizarProducto) => Promise<ProductoAdmin | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  updateStock: (id: number, stock: number) => Promise<ProductoAdmin | null>;
};

export function useAdminProducts(): UseAdminProductsState {
  const api = useApiClient();
  const productService = useMemo(() => makeProductService(api), [api]);

  const [products, setProducts] = useState<ProductoAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      const e = err as any;
      const msg = e?.response?.data?.message || e?.message || "Error al obtener los productos";
      setError(msg);
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  }, [productService]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (data: CrearProducto): Promise<ProductoAdmin | null> => {
    try {
      const newProduct = await productService.createProduct(data);
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      const e = err as any;
      const msg = e?.response?.data?.message || e?.message || "Error al crear el producto";
      setError(msg);
      console.error("Error creating product:", err);
      return null;
    }
  };

  const updateProduct = async (
    id: number,
    data: ActualizarProducto
  ): Promise<ProductoAdmin | null> => {
    try {
      const updatedProduct = await productService.updateProduct(id, data);
      setProducts((prev) =>
        prev.map((p) => (p.id_prenda === id ? updatedProduct : p))
      );
      return updatedProduct;
    } catch (err) {
      const e = err as any;
      const msg = e?.response?.data?.message || e?.message || "Error al actualizar el producto";
      setError(msg);
      console.error("Error updating product:", err);
      return null;
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id_prenda !== id));
      return true;
    } catch (err) {
      const e = err as any;
      const msg = e?.response?.data?.message || e?.message || "Error al eliminar el producto";
      setError(msg);
      console.error("Error deleting product:", err);
      return false;
    }
  };

  const updateStock = async (
    id: number,
    stock: number
  ): Promise<ProductoAdmin | null> => {
    try {
      const updatedProduct = await productService.updateStock(id, {
        stock_disponible: stock,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id_prenda === id ? updatedProduct : p))
      );
      return updatedProduct;
    } catch (err) {
      const e = err as any;
      const msg = e?.response?.data?.message || e?.message || "Error al actualizar el stock";
      setError(msg);
      console.error("Error updating stock:", err);
      return null;
    }
  };

  return {
    products,
    isLoading,
    error,
    refreshProducts: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
  };
}

type UseInventoryState = {
  inventory: ResumenInventario | null;
  isLoading: boolean;
  error: string | null;
  refreshInventory: () => Promise<void>;
};

export function useInventory(): UseInventoryState {
  const api = useApiClient();
  const productService = useMemo(() => makeProductService(api), [api]);

  const [inventory, setInventory] = useState<ResumenInventario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await productService.getInventory();
      setInventory(data);
    } catch (err) {
      const e = err as any;
      const msg = e?.response?.data?.message || e?.message || "Error al obtener el inventario";
      setError(msg);
      console.error("Error fetching inventory:", err);
    } finally {
      setIsLoading(false);
    }
  }, [productService]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    inventory,
    isLoading,
    error,
    refreshInventory: fetchInventory,
  };
}

type UseCategoriesState = {
  categories: string[];
  isLoading: boolean;
  error: string | null;
};

export function useCategories(): UseCategoriesState {
  const api = useApiClient();
  const productService = useMemo(() => makeProductService(api), [api]);

  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await productService.getCategories();
        if (!cancelled) {
          setCategories(data);
        }
      } catch (err) {
        if (!cancelled) {
          const e = err as any;
          const msg = e?.response?.data?.message || e?.message || "Error al obtener las categorías";
          setError(msg);
          console.error("Error fetching categories:", err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, [productService]);

  return {
    categories,
    isLoading,
    error,
  };
}
