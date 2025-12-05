import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminHeader() {
  return (
    <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">PERI Manager</h1>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="w-5 h-5" />
          Administrador
        </Button>
      </div>
    </header>
  )
}