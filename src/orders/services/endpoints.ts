export const ORDER_ENDPOINTS = {
  // Pedidos
  getAllOrders: "/admin/pedidos",
  getOrderById: (id: number) => `/admin/pedidos/${id}`,
  updateOrderStatus: (id: number) => `/admin/pedidos/${id}/estado`,
} as const;

