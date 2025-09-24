"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCompleteForm } from "@/hooks/use-complete-form"

export default function CompletePage() {
  const { displayName, setDisplayName, bio, setBio, location, setLocation, error, handleComplete } = useCompleteForm()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-facebook-blue mb-2">MicroBlog</h1>
          <p className="text-gray-600">Complete your profile to start connecting.</p>
        </div>

        {/* Complete Profile Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
            <CardDescription className="text-center">
              A complete profile helps you connect with more people.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleComplete}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Enter your display name"
                  className="h-12 text-base"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  type="text"
                  placeholder="Tell us about yourself"
                  className="h-12 text-base"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter your location"
                  className="h-12 text-base"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button
                type="submit"
                className="w-full h-12 bg-facebook-blue hover:bg-facebook-blue/90 text-white font-semibold text-base"
              >
                Complete Profile
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}
