"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2 } from "lucide-react"

export default function UsersPage() {
  const [users] = useState([
    { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "Cliente", status: "Activo" },
    { id: 2, name: "María García", email: "maria@example.com", role: "Cliente", status: "Activo" },
    { id: 3, name: "Carlos López", email: "carlos@example.com", role: "Administrador", status: "Activo" },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
        <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4" />
          Agregar Usuario
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Correo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rol</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-secondary/50">
                  <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4 text-foreground">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </Button>
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
