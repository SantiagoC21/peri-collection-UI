"use client"

import { useState, use, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import { useProductDetail } from "@/hooks/useProductDetail"
import { useAddToCart } from "@/hooks/useAddToCart"
import nearestColor from "nearest-color"



export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const numericId = Number(resolvedParams.id)
  const { product: detail, isLoading, error } = useProductDetail(Number.isNaN(numericId) ? null : numericId)
  const { addToCart, error: addToCartError, isLoading: isAddingToCart } = useAddToCart()

  const [selectedSize, setSelectedSize] = useState("")
  console.log("Talla seleccionada: ", selectedSize)
  const [selectedColor, setSelectedColor] = useState("")
  console.log("Color seleccionado: ", selectedColor)
  const [quantity,  setQuantity] = useState(1)
  console.log("Cantidad seleccionada: ", quantity)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [localError, setLocalError] = useState<string | null>(null)

  const coloresBase = {
    'Negro': '#000000',
    'Blanco': '#FFFFFF',
    'Rojo': '#FF0000',
    'Verde': '#008000',
    'Azul': '#0000FF',
    'Amarillo': '#FFFF00',
    'Cian': '#00FFFF',
    'Magenta': '#FF00FF',
    'Gris': '#808080',
    'Naranja': '#FFA500',
    'Rosa': '#FFC0CB',
    'Morado': '#800080',
    'Vino': '#722F37'
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p>Cargando producto...</p>
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/customer/catalog" className="text-accent hover:text-accent/90 mb-6 inline-flex items-center gap-1">
          
          Volver al catalogo
        </Link>
        <p className="text-red-500 mb-2">{error || "No se encontro el producto."}</p>
      </div>
    )
  }

  const product = {
    id: detail.producto.id_prenda,
    name: detail.producto.nombre_prenda,
    price: `S/ ${detail.producto.precio_prenda.toFixed(2)}`,
    rating: detail.producto.stats.calificacion,
    reviews: detail.producto.stats.total_reseñas,
    description: detail.producto.descripcion_prenda,
    details: [detail.producto.descripcion_prenda],
    sizes: Array.from(new Set(detail.variantes.map((v) => v.talla))),
    colors: Array.from(new Set(detail.variantes.map((v) => v.color)))
  }

  const images = ["👗", "👗", "👗", "👗"]

  const buscarColor = nearestColor.from(coloresBase)

  const effectiveSelectedColor =
    selectedColor || (product.colors.length > 0 ? product.colors[0] : "")

  const selectedVariant = detail.variantes.find(
    (v) => v.talla === selectedSize && v.color === effectiveSelectedColor
  );

  const selectedVariantId: number | null = selectedVariant ? selectedVariant.id_variante : null;

  console.log("ID variante seleccionada: ", selectedVariantId)

  const maxQuantity = selectedVariant ? selectedVariant.stock : 0;

  const availableSizesForColor: string[] = effectiveSelectedColor
    ? Array.from(
        new Set(
          detail.variantes
            .filter((v) => v.color === effectiveSelectedColor)
            .map((v) => v.talla)
        )
      )
    : product.sizes

  const EtiquetaColor = ({ hexColor }: { hexColor: string }) => {
    const resultado = buscarColor(hexColor) as { name: string };
    return (
      <div className="flex items-center gap-2">
        {/* El círculo muestra el color REAL exacto de la BD */}
        <div 
          style={{ 
            backgroundColor: hexColor, 
            width: 24, 
            height: 24, 
            borderRadius: '50%',
            border: '1px solid black',
          }}
        />


        {/* El texto muestra la aproximación en español */}
        <p>
          {resultado.name}
        </p>
      </div>
    ); 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/customer/catalog" className="text-accent hover:text-accent/90 mb-6 inline-flex items-center gap-1">
        ← Volver al Catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative w-full h-96 md:h-[500px] bg-secondary rounded-xl flex items-center justify-center overflow-hidden group">
            <div className="text-8xl">{images[currentImageIndex]}</div>

            {/* Navigation Buttons */}
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-20 bg-secondary rounded-lg flex items-center justify-center text-3xl border-2 transition-all ${
                  currentImageIndex === index ? "border-accent" : "border-transparent"
                }`}
              >
                {_}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold text-foreground">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reseñas)</span>
              </div>
            </div>
          </div>

          <div className="text-3xl font-bold text-foreground">{product.price}</div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Color Selection */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Color</h3>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color)
                    setSelectedSize("")
                  }}
                  className={`px-4 py-2 border border-border rounded-lg hover:border-accent transition-colors text-sm ${
                    effectiveSelectedColor === color
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-transparent"
                  }`}
                >
                  <EtiquetaColor hexColor={color} />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Talla</h3>
            <div className="grid grid-cols-5 gap-2">
              {availableSizesForColor.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(prev => prev === size ? "" : size)}
                  className={`py-2 border rounded-lg font-medium transition-all ${
                    selectedSize === size
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-accent"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Cantidad</h3>

            <p className="text-sm text-muted-foreground mb-1">
              {selectedVariant
                ? `Cantidad max: ${maxQuantity}`
                : "-"
              }
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                disabled={!selectedVariant || quantity <= 1}
              >
                −
              </button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => {
                  if (quantity < maxQuantity) {
                    setQuantity(quantity + 1)
                  }
                }}
                disabled={!selectedVariant || quantity >= maxQuantity}
                className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            {(localError || addToCartError) && (
              <p className="text-sm text-red-500">{localError || addToCartError}</p>
            )}
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-medium"
              disabled={isAddingToCart}
              onClick={async () => {
                if (!selectedVariantId) {
                  setLocalError("Seleccione un color y talla antes de agregar al carrito.")
                  return
                }

                setLocalError(null)
                await addToCart({ id_variante: selectedVariantId, cantidad: quantity })
              }}
            >
              Agregar al Carrito
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                <Heart className="w-5 h-5" />
                Favorito
              </Button>
              <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                <Share2 className="w-5 h-5" />
                Compartir
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-3">Detalles del Producto</h3>
            <ul className="space-y-2">
              {product.details.map((detail, index) => (
                <li key={index} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-accent">•</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          {/* Try On Button */}
          <Button variant="outline" className="w-full gap-2 py-3 bg-transparent">
            📱 Prueba Virtual (AR)
          </Button>
        </div>
      </div>
    </div>
  )
}
