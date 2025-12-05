"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Package } from "lucide-react"
import { useAdminProducts, useInventory } from "@/hooks/useAdminProducts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function InventoryPage() {
  const { products, updateStock, isLoading: productsLoading } = useAdminProducts()
  const { inventory, isLoading: inventoryLoading } = useInventory()
  
  const [editingStock, setEditingStock] = useState<number | null>(null)
  const [newStock, setNewStock] = useState<number>(0)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleEditarStock = (productId: number, currentStock: number) => {
    setEditingStock(productId)
    setNewStock(currentStock)
  }

  const handleGuardarStock = async (productId: number) => {
    setIsUpdating(true)
    const result = await updateStock(productId, newStock)
    if (result) {
      setEditingStock(null)
      setNewStock(0)
    }
    setIsUpdating(false)
  }

  const handleCancelar = () => {
    setEditingStock(null)
    setNewStock(0)
  }

  if (productsLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const stockNormal = (products ?? []).filter(p => p.stock_disponible >= 10).length
  const stockBajo = (products ?? []).filter(p => p.stock_disponible > 0 && p.stock_disponible < 10).length
  const agotados = (products ?? []).filter(p => p.stock_disponible === 0).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestión de Inventario</h1>
        <p className="text-muted-foreground mt-2">Monitorea y ajusta los niveles de stock</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Total Productos</p>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {inventory?.total_productos || (products ?? []).length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Stock Normal</p>
          <p className="text-3xl font-bold text-green-600">
            {inventory?.en_stock || stockNormal}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Stock Bajo</p>
          <p className="text-3xl font-bold text-yellow-600">
            {inventory?.stock_bajo || stockBajo}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Agotados</p>
          <p className="text-3xl font-bold text-red-600">
            {inventory?.agotados || agotados}
          </p>
        </Card>
      </div>

      {(stockBajo > 0 || agotados > 0) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atención requerida</AlertTitle>
          <AlertDescription>
            Hay {stockBajo} producto(s) con stock bajo y {agotados} producto(s) agotado(s).
          </AlertDescription>
        </Alert>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Producto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Categoría</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock Actual</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(products ?? []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No hay productos en el inventario
                  </td>
                </tr>
              ) : (
                (products ?? []).map((product) => (
                  <tr key={product.id_prenda} className="border-b border-border hover:bg-secondary/50">
                    <td className="px-6 py-4 text-foreground">{product.nombre_prenda}</td>
                    <td className="px-6 py-4 text-muted-foreground">{product.sku || "-"}</td>
                    <td className="px-6 py-4 text-foreground">{product.categoria_prenda}</td>
                    <td className="px-6 py-4 text-center">
                      {editingStock === product.id_prenda ? (
                        <Input
                          type="number"
                          min="0"
                          value={newStock}
                          onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                          className="w-24"
                          disabled={isUpdating}
                        />
                      ) : (
                        <span className={`font-semibold ${
                          product.stock_disponible === 0
                            ? "text-red-600"
                            : product.stock_disponible < 10
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}>
                          {product.stock_disponible}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock_disponible === 0
                          ? "bg-red-100 text-red-800"
                          : product.stock_disponible < 10
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {product.stock_disponible === 0 ? "Agotado" : product.stock_disponible < 10 ? "Stock Bajo" : "Normal"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {editingStock === product.id_prenda ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleGuardarStock(product.id_prenda)}
                            disabled={isUpdating}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelar}
                            disabled={isUpdating}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditarStock(product.id_prenda, product.stock_disponible)}
                          className="gap-1"
                        >
                          📦 Editar Stock
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
