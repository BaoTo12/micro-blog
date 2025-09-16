export interface BlogPost {
  id: string
  author: {
    name: string
    avatar: string
    username: string
  }
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
}

export const samplePosts: BlogPost[] = [
  {
    id: "1",
    author: {
      name: "Sarah Johnson",
      avatar: "/woman-profile.png",
      username: "sarah.johnson",
    },
    content:
      "Just finished reading an amazing book about web development! The future of React looks incredibly promising. Can't wait to implement some of these new patterns in my next project. 📚✨",
    image: "/books-coding-setup.jpg",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: false,
  },
  {
    id: "2",
    author: {
      name: "Mike Chen",
      avatar: "/asian-man-profile.png",
      username: "mike.chen",
    },
    content:
      "Beautiful sunset from my office window today. Sometimes you need to pause and appreciate the simple moments in life. Hope everyone is having a great day! 🌅",
    image: "/sunset-office-window.jpg",
    timestamp: "4 hours ago",
    likes: 156,
    comments: 23,
    shares: 12,
    isLiked: true,
  },
  {
    id: "3",
    author: {
      name: "Emily Rodriguez",
      avatar: "/latina-woman-profile.png",
      username: "emily.rodriguez",
    },
    content:
      "Excited to announce that I'll be speaking at the upcoming Tech Conference 2024! My talk will be about 'Building Scalable Web Applications with Modern JavaScript'. See you there! 🎤",
    timestamp: "6 hours ago",
    likes: 89,
    comments: 15,
    shares: 7,
    isLiked: false,
  },
  {
    id: "4",
    author: {
      name: "David Kim",
      avatar: "/man-profile-korean.jpg",
      username: "david.kim",
    },
    content:
      "Coffee shop coding session complete! There's something magical about the ambient noise and caffeine that just makes the code flow better. What's your favorite coding environment? ☕️💻",
    image: "/coffee-shop-laptop-coding.jpg",
    timestamp: "8 hours ago",
    likes: 67,
    comments: 31,
    shares: 5,
    isLiked: true,
  },
  {
    id: "5",
    author: {
      name: "Lisa Thompson",
      avatar: "/blonde-woman-profile.png",
      username: "lisa.thompson",
    },
    content:
      "Just deployed my first full-stack application! It's a simple blog platform, but I'm so proud of how far I've come. Thank you to everyone who supported me on this journey. Next stop: adding real-time features! 🚀",
    timestamp: "12 hours ago",
    likes: 203,
    comments: 45,
    shares: 18,
    isLiked: false,
  },
]
