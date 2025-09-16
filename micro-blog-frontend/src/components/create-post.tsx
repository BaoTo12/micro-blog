import { ImageIcon, Smile, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function CreatePost() {
  return (
    <Card className="mb-6 shadow-sm border-border">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/user-profile-illustration.png" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[80px] resize-none border-0 bg-secondary focus:ring-2 focus:ring-primary/20 text-base"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Smile className="h-4 w-4 mr-2" />
                  Feeling
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </Button>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Post</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
