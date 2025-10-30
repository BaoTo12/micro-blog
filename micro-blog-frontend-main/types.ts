export interface User {
  id: string;
  name: string;
  email: string;
  profilePictureUrl: string;
  bio: string;
  joinDate: string;
}

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    profilePictureUrl: string;
  };
  text: string;
  timestamp: string;
}

export interface ContentItem {
  id: string;
  slug: string;
  title: string;
  author: {
    name: string;
    profilePictureUrl: string;
  };
  publishDate: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  tags: string[];
  content: string;
  likes: number;
  likedBy: string[]; // array of user IDs
  comments: Comment[];
}

export interface Message {
    id: string;
    sender: {
        id: string;
        name: string;
        profilePictureUrl: string;
    };
    text: string;
    timestamp: string;
}

export interface Conversation {
    id: string;
    participants: {
        id: string;
        name: string;
        profilePictureUrl: string;
    }[];
    messages: Message[];
}
