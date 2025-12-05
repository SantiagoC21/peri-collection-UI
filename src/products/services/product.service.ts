// Tipado inline para evitar problemas de exports de axios
import {
  ProductoAdmin,
  CrearProducto,
  ActualizarProducto,
  ResumenInventario,
  ActualizarStock,
} from "../schemas/product.schema";
import { PRODUCT_ENDPOINTS } from "./endpoints";

type ApiClient = {
  get: <T = any>(url: string) => Promise<{ data: T }>;
  post: <T = any>(url: string, body?: any) => Promise<{ data: T }>;
  put: <T = any>(url: string, body?: any) => Promise<{ data: T }>;
  delete: (url: string) => Promise<any>;
};

export const makeProductService = (api: ApiClient) => ({
  /**
   * Obtener todos los productos
   */
  async getAllProducts(): Promise<ProductoAdmin[]> {
    const response = await api.get<{
      status: string;
      code: number;
      message: string;
      productos: ProductoAdmin[];
    }>(PRODUCT_ENDPOINTS.getAllProducts);

    return response.data.productos;
  },

  /**
   * Obtener un producto por ID
   */
  async getProductById(id: number): Promise<ProductoAdmin> {
    const response = await api.get<{
      status: string;
      code: number;
      message: string;
      producto: ProductoAdmin;
    }>(PRODUCT_ENDPOINTS.getProductById(id));

    return response.data.producto;
  },

  /**
   * Crear un nuevo producto
   */
  async createProduct(data: CrearProducto): Promise<ProductoAdmin> {
    const response = await api.post<{
      status: string;
      code: number;
      message: string;
      producto: ProductoAdmin;
    }>(PRODUCT_ENDPOINTS.createProduct, data);

    return response.data.producto;
  },

  /**
   * Actualizar un producto existente
   */
  async updateProduct(
    id: number,
    data: ActualizarProducto
  ): Promise<ProductoAdmin> {
    const response = await api.put<{
      status: string;
      code: number;
      message: string;
      producto: ProductoAdmin;
    }>(PRODUCT_ENDPOINTS.updateProduct(id), data);

    return response.data.producto;
  },

  /**
   * Eliminar un producto
   */
  async deleteProduct(id: number): Promise<void> {
    await api.delete(PRODUCT_ENDPOINTS.deleteProduct(id));
  },

  /**
   * Actualizar solo el stock de un producto
   */
  async updateStock(id: number, stock: ActualizarStock): Promise<ProductoAdmin> {
    const response = await api.put<{
      status: string;
      code: number;
      message: string;
      producto: ProductoAdmin;
    }>(PRODUCT_ENDPOINTS.updateStock(id), stock);

    return response.data.producto;
  },

  /**
   * Obtener resumen del inventario
   */
  async getInventory(): Promise<ResumenInventario> {
    const response = await api.get<{
      status: string;
      code: number;
      message: string;
      inventario: ResumenInventario;
    }>(PRODUCT_ENDPOINTS.getInventory);

    return response.data.inventario;
  },

  /**
   * Obtener lista de categorías
   */
  async getCategories(): Promise<string[]> {
    const response = await api.get<{
      status: string;
      code: number;
      message: string;
      categorias: string[];
    }>(PRODUCT_ENDPOINTS.getCategories);

    return response.data.categorias;
  },
});

export type ProductService = ReturnType<typeof makeProductService>;
