"use client"

import Link from "next/link"
import { ShoppingCart, Search, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function CustomerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartPopoverOpen, setCartPopoverOpen] = useState(false)

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/customer" className="text-2xl font-bold text-foreground tracking-wider">
            PERI
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 mx-8">
            <div className="w-full flex items-center bg-secondary rounded-full px-4 py-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full bg-transparent px-3 py-1 outline-none text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/customer/account/personalInfo">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="w-5 h-5" />
                <span className="text-sm">Mi Cuenta</span>
              </Button>
            </Link>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setCartPopoverOpen((open) => !open)}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-sm">Carrito</span>
              </Button>

              {cartPopoverOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 bg-background border border-border rounded-lg shadow-lg flex flex-col z-50">
                  <div className="absolute -top-2 right-6 w-4 h-4 bg-background border-l border-t border-border rotate-45" />

                  <div className="pt-3 px-4 pb-2 border-b border-border">
                    <p className="font-semibold text-foreground text-sm">Carrito</p>
                  </div>
                  <div className="px-4 py-2 border-b border-border text-xs text-muted-foreground">
                    Variantes añadidas a tu carrito:
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 text-sm max-h-56">
                    <div className="border border-border rounded-md p-2 flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-foreground truncate">Nombre de prenda</span>
                        <span className="text-xs text-muted-foreground">x1</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Color: Ejemplo</span>
                        <span>Talla: M</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>ID variante: 0000</span>
                        <span className="font-semibold text-foreground">S/ 0.00</span>
                      </div>
                    </div>
                    <div className="border border-dashed border-border rounded-md p-2 text-xs text-muted-foreground text-center">
                      Aquí se listarán las variantes reales del carrito.
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm bg-secondary/40">
                    <span className="text-muted-foreground">Total estimado</span>
                    <Link
                      href="/customer/cart"
                      className="text-xs text-primary hover:underline font-medium"
                      onClick={() => setCartPopoverOpen(false)}
                    >
                      Ir a Carrito
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 border-t border-border pt-4">
            <div className="flex items-center bg-secondary rounded-full px-4 py-2 mb-4">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full bg-transparent px-3 py-1 outline-none text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>
            <Link href="/customer/catalog" className="block">
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                Catálogo
              </Button>
            </Link>
            <Link href="/customer/account/personalInfo" className="block">
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <User className="w-5 h-5" />
                Mi Cuenta
              </Button>
            </Link>
            <div className="relative">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sm"
                onClick={() => setCartPopoverOpen((open) => !open)}
              >
                <ShoppingCart className="w-5 h-5" />
                Carrito
              </Button>

              {cartPopoverOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 bg-background border border-border rounded-lg shadow-lg flex flex-col z-50">
                  <div className="absolute -top-2 right-6 w-4 h-4 bg-background border-l border-t border-border rotate-45" />

                  <div className="pt-3 px-4 pb-2 border-b border-border">
                    <p className="font-semibold text-foreground text-sm">Carrito</p>
                  </div>
                  <div className="px-4 py-2 border-b border-border text-xs text-muted-foreground">
                    Variantes añadidas a tu carrito:
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 text-sm max-h-56">
                    <div className="border border-border rounded-md p-2 flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-foreground truncate">Nombre de prenda</span>
                        <span className="text-xs text-muted-foreground">x1</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Color: Ejemplo</span>
                        <span>Talla: M</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>ID variante: 0000</span>
                        <span className="font-semibold text-foreground">S/ 0.00</span>
                      </div>
                    </div>
                    <div className="border border-dashed border-border rounded-md p-2 text-xs text-muted-foreground text-center">
                      Aquí se listarán las variantes reales del carrito.
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm bg-secondary/40">
                    <span className="text-muted-foreground">Total estimado</span>
                    <Link
                      href="/customer/cart"
                      className="text-xs text-primary hover:underline font-medium"
                      onClick={() => setCartPopoverOpen(false)}
                    >
                      Ir a Carrito
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
