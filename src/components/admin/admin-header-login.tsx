import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminHeaderLogin() {
  
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="h-14 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">PERI Manager</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notificaciones">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Administrador</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
