import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { BlogPost } from "@/constants/sample-data"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: BlogPost
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="mb-4 shadow-sm border-border">
      <CardContent className="p-0">
        {/* Post Header */}
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{post.author.name}</h3>
              <p className="text-xs text-muted-foreground">
                @{post.author.username} • {post.timestamp}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-3">
          <p className="text-sm leading-relaxed">{post.content}</p>
        </div>

        {/* Post Image */}
        {post.image && (
          <div className="px-4 pb-3">
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post content"
              className="w-full rounded-lg object-cover max-h-96"
            />
          </div>
        )}

        {/* Engagement Stats */}
        <div className="px-4 py-2 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{post.likes} likes</span>
            <div className="flex gap-4">
              <span>{post.comments} comments</span>
              <span>{post.shares} shares</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-around py-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 gap-2 text-muted-foreground hover:text-foreground",
              post.isLiked && "text-red-500 hover:text-red-600",
            )}
          >
            <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
            Like
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-foreground">
            <MessageCircle className="h-4 w-4" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 gap-2 text-muted-foreground hover:text-foreground">
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
