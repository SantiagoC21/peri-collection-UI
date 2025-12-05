import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-foreground">PERI COLLECTION</h1>
          <p className="text-xl text-muted-foreground">Marca Peruana creada por el Diseñador de Moda</p>

          <div className="flex gap-4 justify-center pt-8">
            <Link href="/customer">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Compra ahora
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="outline">
                Panel Administrativo
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16">
            <div className="p-8 border border-border rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Portal de Cliente</h2>
              <ul className="space-y-2 text-left text-muted-foreground">
                <li>• Explorar catálogo de moda</li>
                <li>• Prueba Virtual (AR)</li>
                <li>• Checkout Seguro</li>
                <li>• Seguimiento de pedidos</li>
                <li>• Gestión de devoluciones</li>
              </ul>
            </div>

            <div className="p-8 border border-border rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Portal Administrativo</h2>
              <ul className="space-y-2 text-left text-muted-foreground">
                <li>• Gestión de productos</li>
                <li>• Control de inventario</li>
                <li>• Gestión de pedidos</li>
                <li>• Procesamiento de devoluciones</li>
                <li>• Panel de análisis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
