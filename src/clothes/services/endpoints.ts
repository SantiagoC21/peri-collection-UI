export const CLOTHES_ENDPOINTS = {
  getMainCatalog: "/catalogo",
  getProductById: (id: number) => `/users/obtener_detalle_producto/${id}`,
} as const;
