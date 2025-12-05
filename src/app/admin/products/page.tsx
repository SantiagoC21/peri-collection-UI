"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, Search, Loader2, AlertCircle } from "lucide-react"
import { useAdminProducts, useCategories } from "@/hooks/useAdminProducts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { CrearProducto, ProductoAdmin } from "@/products/schemas/product.schema"
import { HexColorPicker } from "react-colorful"

export default function ProductsPage() {
  const { 
    products, 
    isLoading, 
    error, 
    createProduct, 
    updateProduct, 
    deleteProduct 
  } = useAdminProducts()
  const { categories } = useCategories()
  
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<CrearProducto>({
    nombre_prenda: "",
    categoria_prenda: "",
    descripcion: "",
    precio_prenda: 0,
    stock_disponible: 0,
    sku: "",
    talla: "",
    color: "",
    imagen_prenda: "",
  })

  const resetForm = () => {
    setFormData({
      nombre_prenda: "",
      categoria_prenda: "",
      descripcion: "",
      precio_prenda: 0,
      stock_disponible: 0,
      sku: "",
      talla: "",
      color: "",
      imagen_prenda: "",
    })
    setEditingId(null)
    setFormError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFormError(null)

    try {
      if (editingId) {
        const result = await updateProduct(editingId, formData)
        if (result) {
          setShowForm(false)
          resetForm()
        } else {
          setFormError("Error al actualizar el producto")
        }
      } else {
        const result = await createProduct(formData)
        if (result) {
          setShowForm(false)
          resetForm()
        } else {
          setFormError("Error al crear el producto")
        }
      }
    } catch (err) {
      setFormError("Ocurrió un error inesperado")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (product: ProductoAdmin) => {
    setEditingId(product.id_prenda)
    setFormData({
      nombre_prenda: product.nombre_prenda,
      categoria_prenda: product.categoria_prenda,
      descripcion: product.descripcion || "",
      precio_prenda: product.precio_prenda,
      stock_disponible: product.stock_disponible,
      sku: product.sku || "",
      talla: product.talla || "",
      color: product.color || "",
      imagen_prenda: product.imagen_prenda || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      await deleteProduct(id)
    }
  }

  const filteredProducts = (products ?? []).filter(product => {
    if (!product || !searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      (product.nombre_prenda && product.nombre_prenda.toLowerCase().includes(search)) ||
      (product.categoria_prenda && product.categoria_prenda.toLowerCase().includes(search)) ||
      (product.sku && product.sku.toLowerCase().includes(search))
    );
  })

  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Catálogo de Productos</h1>
        <Button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Plus className="w-4 h-4" />
          Agregar Producto
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {editingId ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          {formError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre" className="text-foreground">Nombre del Producto *</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ej: Blazer Clásico"
                  value={formData.nombre_prenda}
                  onChange={(e) => setFormData({...formData, nombre_prenda: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sku" className="text-foreground">SKU</Label>
                <Input
                  id="sku"
                  type="text"
                  placeholder="ID-P-T-XXXXXX"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="precio" className="text-foreground">Precio *</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  placeholder="299.00"
                  value={formData.precio_prenda || ""}
                  onChange={(e) => setFormData({...formData, precio_prenda: parseFloat(e.target.value) || 0})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="stock" className="text-foreground">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="50"
                  value={formData.stock_disponible}
                  onChange={(e) => setFormData({...formData, stock_disponible: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="categoria" className="text-foreground">Categoría *</Label>
                <select
                  id="categoria"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground"
                  value={formData.categoria_prenda}
                  onChange={(e) => setFormData({...formData, categoria_prenda: e.target.value})}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Blazers">Blazers</option>
                  <option value="Vestidos">Vestidos</option>
                  <option value="Pantalones">Pantalones</option>
                  <option value="Camisas">Camisas</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>
              <div>
                <Label htmlFor="talla" className="text-foreground">Talla</Label>
                <Input
                  id="talla"
                  type="text"
                  placeholder="M, L, XL"
                  value={formData.talla}
                  onChange={(e) => setFormData({...formData, talla: e.target.value})}
                />
              </div>
              <div className="relative">
                <Label htmlFor="color" className="text-foreground">Color</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input
                    id="color"
                    type="text"
                    placeholder="Ej: #000000"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    onClick={() => setIsColorPickerOpen(true)}
                    readOnly
                  />
                  <div
                    className="h-8 w-8 rounded-md border border-border shadow-sm"
                    style={{ backgroundColor: formData.color || "#000000" }}
                  />
                </div>

                {isColorPickerOpen && (
                  <>
                    {/* Capa para cerrar al hacer clic fuera */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsColorPickerOpen(false)}
                    />

                    <div
                      className="absolute z-50 mt-2 rounded-lg border border-border bg-background p-3 shadow-lg"
                      style={{ minWidth: "220px" }}
                    >
                      <HexColorPicker
                        color={formData.color || "#000000"}
                        onChange={(color) => setFormData({ ...formData, color })}
                      />
                      <input
                        className="mt-2 w-full rounded-md border border-border px-2 py-1 text-sm bg-background text-foreground"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>
              <div>
                <Label htmlFor="imagen" className="text-foreground">URL de Imagen</Label>
                <Input
                  id="imagen"
                  type="url"
                  placeholder="https://..."
                  value={formData.imagen_prenda}
                  onChange={(e) => setFormData({...formData, imagen_prenda: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="descripcion" className="text-foreground">Descripción</Label>
                <textarea
                  id="descripcion"
                  placeholder="Descripción del producto"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground min-h-[100px]"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                type="submit" 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  editingId ? "Actualizar Producto" : "Guardar Producto"
                )}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                disabled={isSaving}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar productos por nombre, SKU o categoría..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Producto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Categoría</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Precio</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    {searchTerm ? "No se encontraron productos con ese criterio" : "No hay productos registrados"}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id_prenda} className="border-b border-border hover:bg-secondary/50">
                    <td className="px-6 py-4 text-foreground">{product.nombre_prenda}</td>
                    <td className="px-6 py-4 text-muted-foreground">{product.sku || "-"}</td>
                    <td className="px-6 py-4 text-foreground">{product.categoria_prenda}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">S/ {product.precio_prenda.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${
                        product.stock_disponible === 0
                          ? "text-red-600"
                          : product.stock_disponible < 10
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}>
                        {product.stock_disponible}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">unidades</span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(product.id_prenda)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </Button>
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
