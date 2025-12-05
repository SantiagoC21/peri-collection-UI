import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Truck, RotateCcw } from "lucide-react"

export default function CustomerHome() {
  const categories = [
    { name: "Vestidos", icon: "👗" },
    { name: "Blazers", icon: "🧥" },
    { name: "Pantalones", icon: "👖" },
    { name: "Accesorios", icon: "✨" },
  ]

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-secondary to-background py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">Lujo Moderno para Ti</h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Descubre nuestra colección exclusiva de prendas de moda de alta calidad, diseñadas para el mundo
                moderno.
              </p>
              <Link href="/customer/catalog">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                  Explorar Colección
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="h-96 bg-secondary rounded-2xl flex items-center justify-center">
              <div className="text-6xl">👗</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Categorías Destacadas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={`/customer/catalog?category=${category.name.toLowerCase()}`}>
              <div className="p-8 border border-border rounded-xl hover:shadow-lg transition-all cursor-pointer bg-card hover:bg-secondary">
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-foreground">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Nuevas Llegadas</h3>
                <p className="text-sm text-muted-foreground">Estilos frescos cada semana</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Truck className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Envío Rápido</h3>
                <p className="text-sm text-muted-foreground">Entrega en 2-3 días hábiles</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <RotateCcw className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Devoluciones Fáciles</h3>
                <p className="text-sm text-muted-foreground">Garantía de 30 días</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-foreground text-background rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold">Suscríbete a Nuestro Newsletter</h2>
          <p className="text-background/80 max-w-lg mx-auto">
            Recibe ofertas exclusivas y acceso anticipado a nuevas colecciones
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@ejemplo.com"
              className="flex-1 px-4 py-3 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Suscribirse</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
