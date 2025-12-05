"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, DollarSign } from "lucide-react"

export default function ReturnsPage() {
  const [returns, setReturns] = useState([
    {
      id: "DEV-001",
      order: "#1001",
      customer: "Juan Pérez",
      reason: "Talla incorrecta",
      status: "Pendiente",
      amount: "S/ 299.00",
    },
    {
      id: "DEV-002",
      order: "#1002",
      customer: "María García",
      reason: "Producto defectuoso",
      status: "Aprobado",
      amount: "S/ 399.00",
    },
  ])

  const handleApprove = (id: string) => {
    setReturns(returns.map((r) => (r.id === id ? { ...r, status: "Aprobado" } : r)))
  }

  const handleReject = (id: string) => {
    setReturns(returns.map((r) => (r.id === id ? { ...r, status: "Rechazado" } : r)))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Gestión de Devoluciones</h1>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID Devolución</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Pedido</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cliente</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Motivo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Monto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((ret) => (
                <tr key={ret.id} className="border-b border-border hover:bg-secondary/50">
                  <td className="px-6 py-4 font-semibold text-foreground">{ret.id}</td>
                  <td className="px-6 py-4 text-foreground">{ret.order}</td>
                  <td className="px-6 py-4 text-foreground">{ret.customer}</td>
                  <td className="px-6 py-4 text-muted-foreground">{ret.reason}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{ret.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ret.status === "Aprobado"
                          ? "bg-green-100 text-green-800"
                          : ret.status === "Rechazado"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {ret.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {ret.status === "Pendiente" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(ret.id)}
                          className="gap-1 text-green-600 hover:text-green-700"
                        >
                          <Check className="w-4 h-4" />
                          Aprobar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(ret.id)}
                          className="gap-1 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                          Rechazar
                        </Button>
                      </>
                    )}
                    {ret.status === "Aprobado" && (
                      <Button variant="ghost" size="sm" className="gap-1 text-blue-600 hover:text-blue-700">
                        <DollarSign className="w-4 h-4" />
                        Procesar Reembolso
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
