import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground">Configuración</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Información de la Tienda</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Nombre de la Tienda</label>
            <input
              type="text"
              defaultValue="PERI COLLECTION"
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Correo Electrónico</label>
            <input
              type="email"
              defaultValue="admin@peri.com"
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Teléfono</label>
            <input
              type="tel"
              defaultValue="+51 999 123 456"
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            />
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Guardar Cambios</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Configuración de Envíos</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Costo de Envío Predeterminado</label>
            <input
              type="text"
              defaultValue="S/ 10.00"
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Envío Gratis a partir de</label>
            <input
              type="text"
              defaultValue="S/ 100.00"
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            />
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Guardar Cambios</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Configuración de Impuestos</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tasa de IGV (%)</label>
            <input
              type="number"
              defaultValue="18"
              className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            />
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Guardar Cambios</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Seguridad</h2>
        <div className="space-y-4">
          <Button variant="outline" className="w-full bg-transparent">
            Cambiar Contraseña
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            Gestionar Sesiones
          </Button>
        </div>
      </Card>
    </div>
  )
}
