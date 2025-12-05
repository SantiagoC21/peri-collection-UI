export const PRODUCT_ENDPOINTS = {
  // Productos
  getAllProducts: "/admin/productos",
  getProductById: (id: number) => `/admin/productos/${id}`,
  createProduct: "/admin/productos",
  updateProduct: (id: number) => `/admin/productos/${id}`,
  deleteProduct: (id: number) => `/admin/productos/${id}`,
  updateStock: (id: number) => `/admin/productos/${id}/stock`,
  
  // Inventario
  getInventory: "/admin/inventario",
  
  // Categorías
  getCategories: "/admin/categorias",
} as const;
