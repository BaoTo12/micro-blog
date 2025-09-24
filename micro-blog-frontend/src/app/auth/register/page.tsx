"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRegisterForm } from "@/hooks/use-register-form"

export default function RegisterPage() {
  const { email, setEmail, password, setPassword, error, handleRegister } = useRegisterForm()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-facebook-blue mb-2">MicroBlog</h1>
          <p className="text-gray-600">It's quick and easy.</p>
        </div>

        {/* Register Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create a new account</CardTitle>
            <CardDescription className="text-center">
              Join to connect with friends and share your thoughts
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min. 8 characters)"
                  className="h-12 text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="text-xs text-gray-500 leading-relaxed">
                By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy.
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold text-base"
              >
                Sign Up
              </Button>
            </CardContent>
          </form>
        </Card>

        {/* Login Link */}
        <div className="text-center mt-6">
          <Link href="/auth/login" className="text-facebook-blue hover:underline font-medium">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
