import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    { label: "Pedidos Totales", value: "1,234", change: "+12%", trend: "up" },
    { label: "Ingresos", value: "S/ 45,678", change: "+8%", trend: "up" },
    { label: "Productos", value: "342", change: "+5%", trend: "up" },
    { label: "Devoluciones Pendientes", value: "23", change: "-2%", trend: "down" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Panel de Control</h1>
        <p className="text-muted-foreground mt-2">Bienvenido de vuelta al panel de administración de PERI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {stat.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <p className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>{stat.change}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Pedidos Recientes</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center pb-4 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">Pedido #{1000 + i}</p>
                  <p className="text-sm text-muted-foreground">Nombre del Cliente</p>
                </div>
                <span className="text-lg font-semibold text-foreground">S/ 299.00</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Estado del Inventario</h2>
          <div className="space-y-4">
            {[
              { label: "En Stock", value: "245" },
              { label: "Stock Bajo", value: "32" },
              { label: "Agotado", value: "8" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
