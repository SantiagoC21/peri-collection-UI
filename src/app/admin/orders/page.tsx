"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ChevronDown, Loader2, AlertCircle, Printer, ChevronLeft, ChevronRight } from "lucide-react"
import { useAdminOrders } from "@/hooks/useAdminOrders"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OrderDetailResponse, DireccionEnvio } from "@/orders/schemas/order.schema"

const ORDER_STATUSES = [
  "pendiente",
  "en_procesamiento",
  "enviado",
  "en_transito",
  "entregado",
  "cancelado",
]

function formatDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString
  return new Intl.DateTimeFormat("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function formatCurrency(amount: number, currency: string = "PEN"): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

function parseShippingAddress(
  address: string | DireccionEnvio | undefined
): DireccionEnvio | null {
  if (!address) return null
  if (typeof address === "object") return address
  try {
    return JSON.parse(address) as DireccionEnvio
  } catch {
    return null
  }
}

function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    pendiente: "Pendiente",
    en_procesamiento: "En Procesamiento",
    enviado: "Enviado",
    en_transito: "En Tránsito",
    entregado: "Entregado",
    cancelado: "Cancelado",
  }
  return statusMap[status] || status
}

function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    entregado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    enviado: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    en_transito: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    cancelado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    en_procesamiento: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    pendiente: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  }
  return statusColors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
}

const ITEMS_PER_PAGE = 10

export default function OrdersPage() {
  const { orders, isLoading, error, getOrderDetails, updateOrderStatus } = useAdminOrders()
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const [orderDetails, setOrderDetails] = useState<OrderDetailResponse | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (expandedOrder && !orderDetails) {
      loadOrderDetails(expandedOrder)
    }
  }, [expandedOrder])

  const loadOrderDetails = async (orderId: number) => {
    setIsLoadingDetails(true)
    const details = await getOrderDetails(orderId)
    setOrderDetails(details)
    setIsLoadingDetails(false)
  }

  const handleViewDetails = (orderId: number) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
      setOrderDetails(null)
    } else {
      setExpandedOrder(orderId)
      if (!orderDetails || !orderDetails.pedido || orderDetails.pedido.id !== orderId) {
        loadOrderDetails(orderId)
      }
    }
  }

  const handleUpdateStatus = async () => {
    if (!expandedOrder || !newStatus) return

    setIsUpdatingStatus(true)
    try {
      const success = await updateOrderStatus(expandedOrder, { estado: newStatus })
      if (success && orderDetails) {
        setOrderDetails({
          ...orderDetails,
          pedido: { ...orderDetails.pedido, estado: newStatus },
        })
      }
      setShowStatusDialog(false)
      setNewStatus("")
    } catch (err) {
      console.error("Error updating status:", err)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handlePrintLabel = () => {
    // TODO: Implementar cuando esté disponible el endpoint
    console.log("Imprimir etiqueta para pedido:", expandedOrder)
  }

  const shippingAddress = orderDetails?.pedido
    ? parseShippingAddress(orderDetails.pedido.direccion_envio_json)
    : null

  // Calcular paginación
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedOrders = orders.slice(startIndex, endIndex)

  // Resetear página si no hay pedidos en la página actual
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Gestión de Pedidos</h1>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  ID Pedido
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {!Array.isArray(orders) || orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No hay pedidos disponibles
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border hover:bg-secondary/50"
                  >
                    <td className="px-6 py-4 font-semibold text-foreground">
                      #{String(order.id).padStart(4, "0")}
                    </td>
                    <td className="px-6 py-4 text-foreground">{order.cliente.nombre_usuario}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(order.ts_creacion)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {formatCurrency(order.monto_total, order.moneda)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.estado
                        )}`}
                      >
                        {getStatusLabel(order.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(order.id)}
                        className="gap-1"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            expandedOrder === order.id ? "rotate-180" : ""
                          }`}
                        />
                        Ver Detalles
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Paginación */}
      {orders.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} - {Math.min(endIndex, orders.length)} de {orders.length} pedidos
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Mostrar solo algunas páginas alrededor de la actual
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <Button
                        variant={currentPage === page ? "outline" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[2.5rem]"
                      >
                        {page}
                      </Button>
                    </PaginationItem>
                  )
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <PaginationItem key={page}>
                      <span className="px-2 text-muted-foreground">...</span>
                    </PaginationItem>
                  )
                }
                return null
              })}
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {expandedOrder && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Detalles del Pedido #{String(expandedOrder).padStart(4, "0")}
          </h2>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : orderDetails ? (
            <div className="space-y-6">
              {/* Datos del Cliente */}
              {orderDetails.cliente ? (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Datos del Cliente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                      <p className="font-medium text-foreground">
                        {orderDetails.cliente.nombre_usuario || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">
                        {orderDetails.cliente.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium text-foreground">
                        {orderDetails.cliente.telefono || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Documento</p>
                      <p className="font-medium text-foreground">
                        {orderDetails.cliente.documento || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No se pudieron cargar los datos del cliente
                  </AlertDescription>
                </Alert>
              )}

              {/* Estado Actual */}
              {orderDetails.pedido ? (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Estado Actual</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      orderDetails.pedido.estado
                    )}`}
                  >
                    {getStatusLabel(orderDetails.pedido.estado)}
                  </span>
                </div>
              ) : null}

              {/* Dirección de Envío */}
              {shippingAddress && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Dirección de Envío
                  </h3>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    {shippingAddress.calle && (
                      <p className="text-foreground mb-1">
                        <span className="font-semibold">Calle:</span> {shippingAddress.calle}
                      </p>
                    )}
                    {shippingAddress.distrito && (
                      <p className="text-foreground mb-1">
                        <span className="font-semibold">Distrito:</span> {shippingAddress.distrito}
                      </p>
                    )}
                    {shippingAddress.ciudad && (
                      <p className="text-foreground mb-1">
                        <span className="font-semibold">Ciudad:</span> {shippingAddress.ciudad}
                      </p>
                    )}
                    {shippingAddress.codigo_postal && (
                      <p className="text-foreground">
                        <span className="font-semibold">Código Postal:</span>{" "}
                        {shippingAddress.codigo_postal}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Lista de Artículos */}
              {orderDetails.items && orderDetails.items.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Artículos</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary border-b border-border">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">
                            SKU
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">
                            Talla
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">
                            Color
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">
                            Cantidad
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">
                            Precio Unitario
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-border">
                            <td className="px-4 py-3 text-foreground">{item.sku}</td>
                            <td className="px-4 py-3 text-foreground">{item.talla}</td>
                            <td className="px-4 py-3 text-foreground">{item.color}</td>
                            <td className="px-4 py-3 text-foreground">{item.cantidad}</td>
                            <td className="px-4 py-3 text-foreground">
                              {formatCurrency(
                                item.precio_unitario,
                                orderDetails.pedido?.moneda || "PEN"
                              )}
                            </td>
                            <td className="px-4 py-3 font-semibold text-foreground">
                              {formatCurrency(
                                item.subtotal,
                                orderDetails.pedido?.moneda || "PEN"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Resumen de Montos */}
              {orderDetails.pedido && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Resumen de Montos</h3>
                  <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                    {orderDetails.pedido.descuento !== undefined &&
                      orderDetails.pedido.descuento > 0 && (
                        <div className="flex justify-between text-foreground">
                          <span>Descuento:</span>
                          <span className="font-semibold text-red-600">
                            -{formatCurrency(
                              orderDetails.pedido.descuento,
                              orderDetails.pedido.moneda || "PEN"
                            )}
                          </span>
                        </div>
                      )}
                    {orderDetails.pedido.impuestos !== undefined &&
                      orderDetails.pedido.impuestos > 0 && (
                        <div className="flex justify-between text-foreground">
                          <span>Impuestos:</span>
                          <span className="font-semibold">
                            {formatCurrency(
                              orderDetails.pedido.impuestos,
                              orderDetails.pedido.moneda || "PEN"
                            )}
                          </span>
                        </div>
                      )}
                    {orderDetails.pedido.costo_envio !== undefined &&
                      orderDetails.pedido.costo_envio > 0 && (
                        <div className="flex justify-between text-foreground">
                          <span>Costo de Envío:</span>
                          <span className="font-semibold">
                            {formatCurrency(
                              orderDetails.pedido.costo_envio,
                              orderDetails.pedido.moneda || "PEN"
                            )}
                          </span>
                        </div>
                      )}
                    <div className="flex justify-between text-foreground pt-2 border-t border-border">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-lg">
                        {formatCurrency(
                          orderDetails.pedido.monto_total,
                          orderDetails.pedido.moneda || "PEN"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() =>
                        setNewStatus(orderDetails.pedido?.estado || "")
                      }
                      disabled={!orderDetails.pedido}
                    >
                      Actualizar Estado
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Actualizar Estado del Pedido</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="status" className="text-foreground">
                          Nuevo Estado
                        </Label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger id="status" className="w-full mt-2">
                            <SelectValue placeholder="Seleccione un estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getStatusLabel(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowStatusDialog(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleUpdateStatus}
                          disabled={isUpdatingStatus || !newStatus}
                          className="bg-accent text-accent-foreground hover:bg-accent/90"
                        >
                          {isUpdatingStatus && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          )}
                          Guardar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={handlePrintLabel}>
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir Etiqueta
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No se pudieron cargar los detalles del pedido
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
