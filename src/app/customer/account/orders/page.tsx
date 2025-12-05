"use client"

import { useOrders } from "@/hooks/useOrders"

export default function OrdersPage() {
  const { orders, isLoading, error } = useOrders()

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando pedidos...</p>
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Mis Pedidos</h2>
        <p className="text-sm text-muted-foreground">Aún no tienes pedidos registrados.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground mb-2">Mis Pedidos</h2>
      {orders.map((order) => {
        const fecha = new Date(order.fecha_compra).toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })

        const total = `S/ ${Number(order.total_pedido).toFixed(2)}`
        const statusLabel =
          order.estado_pedido === "pagado"
            ? "Pagado"
            : order.estado_pedido === "cancelado"
              ? "Cancelado"
              : order.estado_pedido

        const statusColor =
          order.estado_pedido === "pagado"
            ? "text-green-600"
            : order.estado_pedido === "cancelado"
              ? "text-red-600"
              : "text-blue-600"

        const displayId = order.codigo_boleta ?? `PED-${order.pedido_id}`

        return (
          <div key={order.pedido_id} className="border border-border rounded-xl p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{displayId}</h3>
                <p className="text-sm text-muted-foreground">{fecha}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{total}</p>
                <p className={`text-sm font-medium ${statusColor}`}>{statusLabel}</p>
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>
                {order.items.length} ítem{order.items.length !== 1 ? "s" : ""} en el pedido
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
