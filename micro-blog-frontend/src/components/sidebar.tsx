import { Users, Calendar, Bookmark, TrendingUp, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Sidebar() {
  return (
    <div className="space-y-4">
      {/* User Profile Card */}
      <Card className="shadow-sm border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/user-profile-illustration.png" />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Your Name</h3>
              <p className="text-sm text-muted-foreground">@your.username</p>
            </div>
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <div className="text-center">
              <div className="font-semibold">127</div>
              <div className="text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">1.2K</div>
              <div className="text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">892</div>
              <div className="text-muted-foreground">Following</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-3 px-4 py-3 h-auto">
              <Users className="h-4 w-4" />
              Find Friends
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 px-4 py-3 h-auto">
              <Calendar className="h-4 w-4" />
              Events
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 px-4 py-3 h-auto">
              <Bookmark className="h-4 w-4" />
              Saved Posts
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 px-4 py-3 h-auto">
              <TrendingUp className="h-4 w-4" />
              Trending
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 px-4 py-3 h-auto">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card className="shadow-sm border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Trending Topics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-medium text-sm">#WebDevelopment</p>
            <p className="text-xs text-muted-foreground">12.5K posts</p>
          </div>
          <div>
            <p className="font-medium text-sm">#React</p>
            <p className="text-xs text-muted-foreground">8.2K posts</p>
          </div>
          <div>
            <p className="font-medium text-sm">#TechConference2024</p>
            <p className="text-xs text-muted-foreground">5.7K posts</p>
          </div>
          <div>
            <p className="font-medium text-sm">#CodingLife</p>
            <p className="text-xs text-muted-foreground">3.1K posts</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
