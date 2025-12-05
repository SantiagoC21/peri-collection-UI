import Link from "next/link"

export function CustomerFooter() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-foreground mb-4">PERI COLLECTION</h3>
            <p className="text-sm text-muted-foreground">Moda de lujo para el mundo moderno.</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Tienda</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/customer/catalog" className="hover:text-accent transition-colors">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link href="/customer/catalog?category=new" className="hover:text-accent transition-colors">
                  Nuevas Llegadas
                </Link>
              </li>
              <li>
                <Link href="/customer/catalog?category=sale" className="hover:text-accent transition-colors">
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-accent transition-colors">
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors">
                  Envíos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-accent transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 PERI COLLECTION. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
