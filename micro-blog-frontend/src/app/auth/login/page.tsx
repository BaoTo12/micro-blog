import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-facebook-blue mb-2">MicroBlog</h1>
          <p className="text-gray-600">Connect with friends and the world around you on MicroBlog.</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Log in to MicroBlog</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email or phone number</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email or phone number"
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" className="h-12 text-base" />
            </div>
            <Button className="w-full h-12 bg-facebook-blue hover:bg-facebook-blue/90 text-white font-semibold text-base">
              Log In
            </Button>
            <div className="text-center">
              <Link href="#" className="text-facebook-blue hover:underline text-sm">
                Forgotten password?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>
            <Link href="/auth/register" className="w-full">
              <Button
                variant="outline"
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white border-green-500 font-semibold"
              >
                Create New Account
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>MicroBlog helps you connect and share with the people in your life.</p>
        </div>
      </div>
    </div>
  )
}
