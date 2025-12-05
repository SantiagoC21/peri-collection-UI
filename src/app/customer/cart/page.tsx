"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useFetchDetailCart, useUpdateQuantityDetailCart, useSummaryCart, useDeleteDetailCart } from "@/hooks/useFetchDetailCart"
import type { DetailCart } from "@/clients/schemas/carrito.schema"
import { useCheckout } from "@/hooks/useCheckout"
import { useFetchClientsInfo } from "@/hooks/useFetchClients"

export default function CartPage() {

  const { items, isLoading, error, setItems } = useFetchDetailCart()
  const { updateQuantity, isUpdating } = useUpdateQuantityDetailCart()
  const { deleteItem, isDeleting, error: deleteError } = useDeleteDetailCart()
  const { summary, isLoading: isLoadingSummary, refetchSummary } = useSummaryCart()
  const { processCheckout, isProcessing } = useCheckout()
  const { directions } = useFetchClientsInfo()
  const router = useRouter()

  const handleUpdateQuantity = async (
    item: { id_detalle: number; cantidad: number; stock_actual: number },
    delta: number,
  ) => {
    const newQuantity = item.cantidad + delta

    if (newQuantity < 1) return
    if (newQuantity > item.stock_actual) return

    const updated = await updateQuantity(item.id_detalle, newQuantity)

    if (!updated) return

    setItems((prev: DetailCart[]) =>
      prev.map((it: DetailCart) =>
        it.id_detalle === updated.detalleId
          ? { ...it, cantidad: updated.cantidad, subtotal: updated.subtotal }
          : it,
      ),
    )

    // sincronizar resumen con backend
    await refetchSummary()
  }

  const handleRemove = async (id_detalle: number) => {
    const ok = await deleteItem(id_detalle)
    if (!ok) return

    setItems(prev => prev.filter(it => it.id_detalle !== id_detalle))

    // sincronizar resumen con backend
    await refetchSummary()
  }

  const localSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const subtotal = summary?.subtotal ?? localSubtotal
  const shipping = summary?.costo_envio ?? (subtotal > 0 ? 30 : 0)
  const tax = summary?.impuesto ?? subtotal * 0.18
  const total = summary?.total ?? subtotal + shipping + tax

  const handleCheckout = async () => {
    const defaultDirection =
      directions.find((d) => d.es_predeterminada) ?? directions[0]

    // Si hay al menos una dirección, intentamos crear el pedido desde el carrito
    //if (defaultDirection) {
      const idPedido = await processCheckout({
        id_direccion: defaultDirection.id_direccion,
        costo_envio: shipping,
      }) 

      if (idPedido) {
        router.push(`/customer/checkout/envio?id_pedido=${idPedido}`)
        return
      }
      // Si hubo error en el backend, continuamos igualmente al checkout genérico
    //}

    // Si no hay dirección registrada o falló el proceso en backend,
    // navegamos igual al checkout para que el usuario complete sus datos
    router.push("/customer/checkout/envio")
  } 

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-foreground mb-8">Mi Carrito</h1>

      {isLoading ? (
        <div className="border border-border rounded-xl p-12 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
          <span className="text-muted-foreground text-sm">Cargando tu carrito...</span>
        </div>
      ) : error ? (
        <div className="border border-destructive rounded-xl p-12 text-center">
          <p className="text-destructive mb-2">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="border border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground mb-6">Tu carrito está vacío</p>
          <Link href="/customer/catalog">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Continuar Comprando</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">

            {items.map((item) => (
              <div key={item.id_variante} className="border border-border rounded-xl p-6 flex gap-6">
                <div className="w-24 h-24 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="text-4xl">👗</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{item.nombre_prenda}</h3>
                  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <span>Talla: {item.talla} | Color:</span>
                    <span
                      className="inline-block w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: item.color }}
                    />
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item, -1)}
                        disabled={isUpdating || item.cantidad <= 1}
                        className="px-2 py-1 border border-border rounded hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-6 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item, 1)}
                        disabled={isUpdating || item.cantidad >= item.stock_actual}
                        className="px-2 py-1 border border-border rounded hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        +
                      </button>
                      
                    </div>
                    <span className="font-semibold text-foreground">S/ {item.subtotal}</span>
                    <p className="text-sm text-muted-foreground">Maximo hasta {item.stock_actual}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.id_detalle)}
                  disabled={isDeleting}
                  className="text-destructive hover:text-destructive/80 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border border-border rounded-xl p-6 h-fit sticky top-24">
            <h2 className="text-xl font-semibold text-foreground mb-6">Resumen del Pedido</h2>
            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Envío</span>
                <span>S/ {shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Impuesto (18%)</span>
                <span>S/ {tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold text-foreground mb-6">
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-medium"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              Proceder al Pago
            </Button>
            <Link href="/customer/catalog">
              <Button variant="outline" className="w-full mt-3 bg-transparent">
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
