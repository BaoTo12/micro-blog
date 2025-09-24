"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    router.push("/auth/login")
  }

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <h1 className="text-2xl font-bold text-primary cursor-pointer hover:text-primary/80">MicroBlog</h1>
          </Link>

          {isAuthenticated ? (
            /* Buttons for authenticated users */
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button onClick={handleLogout} variant="ghost" className="text-facebook-blue hover:bg-facebook-blue/10">
                Logout
              </Button>
            </div>
          ) : (
            /* Login/Register buttons for unauthenticated users */
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-facebook-blue hover:bg-facebook-blue/10">
                  Log In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-green-500 hover:bg-green-600 text-white">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
