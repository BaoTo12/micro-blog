import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterPage() {
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
              Join MicroBlog to connect with friends and share your thoughts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" type="text" placeholder="First name" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" type="text" placeholder="Last name" className="h-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email or mobile number</Label>
              <Input id="email" type="email" placeholder="Enter your email or mobile number" className="h-10" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input id="password" type="password" placeholder="Create a password" className="h-10" />
            </div>

            <div className="space-y-2">
              <Label>Birthday</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">January</SelectItem>
                    <SelectItem value="2">February</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">June</SelectItem>
                    <SelectItem value="7">July</SelectItem>
                    <SelectItem value="8">August</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 100 }, (_, i) => (
                      <SelectItem key={2024 - i} value={String(2024 - i)}>
                        {2024 - i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-gray-500">
                Providing your birthday helps make sure you get the right MicroBlog experience for your age.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" className="h-10 justify-start bg-transparent">
                  Female
                </Button>
                <Button variant="outline" className="h-10 justify-start bg-transparent">
                  Male
                </Button>
                <Button variant="outline" className="h-10 justify-start bg-transparent">
                  Custom
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500 leading-relaxed">
              By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS
              Notifications from us and can opt out any time.
            </div>

            <Button className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold text-base">
              Sign Up
            </Button>
          </CardContent>
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
