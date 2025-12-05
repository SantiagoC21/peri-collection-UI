"use client"

const mockReturns = [
  {
    id: "RET-2025-001",
    orderId: "PER-2025-001234",
    reason: "Talla incorrecta",
    status: "Aprobado",
    date: "2025-01-16",
  },
]

export default function ReturnsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-foreground mb-2">Devoluciones</h2>
      {mockReturns.length > 0 ? (
        mockReturns.map((ret) => (
          <div key={ret.id} className="border border-border rounded-xl p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{ret.id}</h3>
                <p className="text-sm text-muted-foreground">Pedido: {ret.orderId}</p>
                <p className="text-sm text-muted-foreground">Razón: {ret.reason}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">{ret.status}</p>
                <p className="text-sm text-muted-foreground">{ret.date}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="border border-border rounded-xl p-12 text-center bg-card">
          <p className="text-muted-foreground">No tienes devoluciones pendientes</p>
        </div>
      )}
    </div>
  )
}
