import { AxiosError, AxiosInstance } from "axios";
import { ClothesMainCatalog, ClothesProductDetail } from "../schemas/clothes.schema"; // Asegúrate que esta ruta sea correcta en tu proyecto
import { CLOTHES_ENDPOINTS } from "./endpoints";

// 1. Definimos la interfaz de los filtros (Tipado fuerte)
export interface CatalogFilters {
  busqueda?: string;
  categorias?: string[];
  colores?: string[];
  tallas?: string[];
  precioMin?: number;
  precioMax?: number;
}

export const makeClothesService = (API_CLOTHES: AxiosInstance) => ({
  // 2. Agregamos el argumento 'filters' opcional
  async getMainCatalog(filters: CatalogFilters = {}): Promise<ClothesMainCatalog[]> {

    try {
      // 3. Transformamos los filtros en parámetros de URL
      const queryParams: any = {};

      if (filters.busqueda) queryParams.busqueda = filters.busqueda;
      
      // Convertimos Arrays a String separado por comas (Backend espera: "Rojo,Azul")
      if (filters.categorias?.length) queryParams.categorias = filters.categorias.join(',');
      if (filters.colores?.length) queryParams.colores = filters.colores.join(',');
      if (filters.tallas?.length) queryParams.tallas = filters.tallas.join(',');

      // Precios
      if (filters.precioMin !== undefined) queryParams.precioMin = filters.precioMin;
      if (filters.precioMax !== undefined) queryParams.precioMax = filters.precioMax;

      // 4. Hacemos la petición pasando los 'params'
      const response = await API_CLOTHES.get<{
        status: string;
        code: number;
        message: string;
        prendas: Array<{
          id_prenda: number;
          categoria_prenda: string;
          nombre_prenda: string;
          precio_prenda: string;
          imagen_prenda: string;
        }>;
      }>(CLOTHES_ENDPOINTS.getMainCatalog, { 
        params: queryParams // <--- AQUÍ SE ENVÍAN LOS FILTROS
      });

      // console.log("Respuesta del backend:", response.data);

      const raw = response.data?.prendas ?? [];

      // 5. Mapeo de datos (Tu lógica original)
      const mapped: ClothesMainCatalog[] = raw.map((item) => ({
        id_prenda: item.id_prenda,
        categoria_prendas: item.categoria_prenda,
        nombre_prenda: item.nombre_prenda,
        precio_prenda: Number(item.precio_prenda),
        url_imagen: item.imagen_prenda,
      }));

      return mapped;

    } catch (error) {
      const axiosErr = error as AxiosError<any>;
      const statusCode = axiosErr.response?.status;
      const backendCode = (axiosErr.response?.data as any)?.code;

      // Manejo de 404 (Si no hay productos con esos filtros, devolvemos lista vacía)
      if (statusCode === 404 || backendCode === 404) {
        return [];
      }

      throw error;
    }
  },

  async getProductById(id: number): Promise<ClothesProductDetail> {
    const response = await API_CLOTHES.get<{
      status: string;
      code: number;
      message: string;
      respuestaFormateado: {
        producto: {
          id_prenda: string;
          nombre_prenda: string;
          descripcion_prenda: string;
          categoria_prendas: string;
          precio_prenda: string;
          stats: {
            calificacion: number;
            total_reseñas: number;
          };
          url_imagen: string[];
        };
        variantes: Array<{
          id_variante: number;
          color: string;
          talla: string;
          stock: string;
        }>;
      };
    }>(CLOTHES_ENDPOINTS.getProductById(id));

    const { producto, variantes } = response.data.respuestaFormateado;

    const mapped: ClothesProductDetail = {
      producto: {
        id_prenda: Number(producto.id_prenda),
        nombre_prenda: producto.nombre_prenda,
        descripcion_prenda: producto.descripcion_prenda,
        categoria_prendas: producto.categoria_prendas,
        precio_prenda: Number(producto.precio_prenda),
        // url_imagen viene ya como array en el detalle
        url_imagen: producto.url_imagen,
        stats: {
          calificacion: producto.stats.calificacion,
          total_reseñas: producto.stats.total_reseñas,
        },
      },
      variantes: variantes.map((v) => ({
        id_variante: v.id_variante,
        color: v.color,
        talla: v.talla,
        stock: Number(v.stock),
      })),
    };

    return mapped;
  },
});