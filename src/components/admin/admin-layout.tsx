"use client"

import type React from "react"
import { AdminSidebar } from "./sidebar"
import { AdminHeaderLogin } from "./admin-header-login"
import { AdminHeader } from "./admin-header"
import { usePathname } from "next/navigation"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/admin/login"

  if(isAuthPage) {
    return (
      <main className="flex-1 flex flex-col">
        <AdminHeaderLogin />
        <main className="flex-1 p-6">{children}</main>
      </main>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
