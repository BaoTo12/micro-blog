import { Search, Bell, MessageCircle, Users, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export function Header() {
  const isAuthenticated = false // This would come from your auth context/state in a real app

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Search */}
          <div className="flex items-center gap-4 flex-1">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer hover:text-primary/80">MicroBlog</h1>
            </Link>
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search MicroBlog"
                className="pl-10 bg-secondary border-0 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {isAuthenticated ? (
            /* Navigation Icons for authenticated users */
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <Home className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <Users className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8 ml-2">
                <AvatarImage src="/user-profile-illustration.png" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
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
