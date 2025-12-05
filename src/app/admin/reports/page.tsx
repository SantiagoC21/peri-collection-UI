"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

export default function ReportsPage() {
  const reports = [
    {
      title: "Reporte de Ventas",
      description: "Análisis detallado de ventas por período",
      icon: "📊",
    },
    {
      title: "Reporte de Inventario",
      description: "Estado actual del stock y movimientos",
      icon: "📦",
    },
    {
      title: "Reporte de Clientes",
      description: "Análisis de comportamiento y compras de clientes",
      icon: "👥",
    },
    {
      title: "Reporte de Devoluciones",
      description: "Análisis de devoluciones y motivos",
      icon: "↩️",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reportes y Análisis</h1>
        <p className="text-muted-foreground mt-2">Genera reportes detallados de tu negocio</p>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex gap-2">
          <div className="flex-1 relative">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground"
            />
          </div>
          <div className="flex-1 relative">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.title} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-2xl mb-2">{report.icon}</p>
                <h3 className="text-lg font-semibold text-foreground">{report.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
              </div>
            </div>
            <Button className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <Download className="w-4 h-4" />
              Descargar Reporte
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Resumen de Ventas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ventas Totales</p>
            <p className="text-2xl font-bold text-foreground">S/ 125,450</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Pedidos</p>
            <p className="text-2xl font-bold text-foreground">342</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ticket Promedio</p>
            <p className="text-2xl font-bold text-foreground">S/ 366.86</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Tasa de Conversión</p>
            <p className="text-2xl font-bold text-foreground">3.2%</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
