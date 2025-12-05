import type React from "react"
import { CustomerHeader } from "./header"
import { CustomerFooter } from "./footer"

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CustomerHeader />
      <main className="flex-1">{children}</main>
      <CustomerFooter />
    </div>
  )
}
