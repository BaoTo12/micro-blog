import { User, ContentItem, Conversation, Comment } from './types';

export const MOCK_USERS: Pick<User, 'id' | 'name' | 'profilePictureUrl'>[] = [
  {
    id: 'fb-12345',
    name: 'Alex Johnson',
    profilePictureUrl: 'https://picsum.photos/seed/alex/100/100',
  },
  {
    id: 'user-2',
    name: 'Bella Rodriguez',
    profilePictureUrl: 'https://picsum.photos/seed/bella/100/100',
  },
  {
    id: 'user-3',
    name: 'Charlie Davis',
    profilePictureUrl: 'https://picsum.photos/seed/charlie/100/100',
  },
];

const generateComments = (contentId: string): Comment[] => {
    switch(contentId) {
        case '1':
            return [
                { id: 'c1-1', author: MOCK_USERS[0], text: 'Great article, this really helped me understand custom hooks!', timestamp: '2024-03-11T14:30:00Z'},
                { id: 'c1-2', author: MOCK_USERS[2], text: 'The section on useMemo was a game-changer for my app\'s performance.', timestamp: '2024-03-12T09:15:00Z'}
            ];
        case '2':
            return [
                { id: 'c2-1', author: MOCK_USERS[1], text: 'I was hesitant about utility-first CSS, but this convinced me to give Tailwind a try.', timestamp: '2024-02-23T11:05:00Z'}
            ];
        default:
            return [];
    }
}


export const MOCK_CONTENT: ContentItem[] = Array.from({ length: 20 }, (_, i) => {
    const baseContent = [
      {
        id: '1',
        slug: 'mastering-react-hooks-2024',
        title: 'Mastering React Hooks in 2024',
        author: { name: 'Bella Rodriguez', profilePictureUrl: 'https://picsum.photos/seed/bella/100/100' },
        publishDate: '2024-03-10',
        excerpt: 'A deep dive into the most powerful React Hooks, including custom hook patterns and performance optimizations.',
        imageUrl: 'https://picsum.photos/seed/react/600/400',
        category: 'React',
        tags: ['react', 'hooks', 'frontend', 'javascript'],
        content: '<p>React Hooks have revolutionized the way we write components. In this article, we will explore advanced patterns for `useState`, `useEffect`, and `useContext`. We will also build our own custom hooks to handle complex logic such as fetching data and managing form state.</p><p>Performance is key. We will look into `useCallback`, `useMemo`, and `React.memo` to prevent unnecessary re-renders and keep your application snappy.</p>',
        likes: 125,
        likedBy: ['fb-12345', 'user-3'],
      },
      {
        id: '2',
        slug: 'tailwind-css-for-modern-uis',
        title: 'Designing Modern UIs with Tailwind CSS',
        author: { name: 'Alex Johnson', profilePictureUrl: 'https://picsum.photos/seed/alex/100/100' },
        publishDate: '2024-02-22',
        excerpt: 'Learn how the utility-first approach of Tailwind CSS can speed up your development workflow and help you build beautiful, responsive designs.',
        imageUrl: 'https://picsum.photos/seed/tailwind/600/400',
        category: 'CSS',
        tags: ['tailwindcss', 'css', 'design', 'ui/ux'],
        content: '<p>Tailwind CSS provides low-level utility classes that let you build completely custom designs without ever leaving your HTML. It\'s a different approach compared to component-based frameworks like Bootstrap, and it offers incredible flexibility.</p><p>We will build a responsive landing page from scratch to see the power of Tailwind in action. We\'ll cover responsive design, dark mode, and customizing your `tailwind.config.js` file.</p>',
        likes: 250,
        likedBy: ['user-2'],
      },
      {
        id: '3',
        slug: 'getting-started-with-typescript',
        title: 'A Practical Guide to Getting Started with TypeScript',
        author: { name: 'Charlie Davis', profilePictureUrl: 'https://picsum.photos/seed/charlie/100/100' },
        publishDate: '2024-01-15',
        excerpt: 'TypeScript adds static types to JavaScript, helping you catch errors early and write more maintainable code. This guide gets you started.',
        imageUrl: 'https://picsum.photos/seed/typescript/600/400',
        category: 'TypeScript',
        tags: ['typescript', 'javascript', 'development'],
        content: '<p>If you\'re a JavaScript developer, you\'ve probably heard about TypeScript. This guide is for you. We\'ll cover the basics of types, interfaces, and how to integrate TypeScript into an existing React project.</p><p>By the end, you\'ll understand the value proposition of TypeScript and be able to start using it in your own projects to improve code quality and developer experience.</p>',
        likes: 98,
        likedBy: [],
      },
        {
        id: '4',
        slug: 'the-rise-of-serverless-architecture',
        title: 'The Rise of Serverless Architecture',
        author: { name: 'Charlie Davis', profilePictureUrl: 'https://picsum.photos/seed/charlie/100/100' },
        publishDate: '2024-03-18',
        excerpt: 'Explore the benefits and challenges of serverless computing and how it\'s changing the way we build and deploy applications.',
        imageUrl: 'https://picsum.photos/seed/serverless/600/400',
        category: 'Backend',
        tags: ['serverless', 'aws', 'cloud', 'architecture'],
        content: '<p>Serverless doesn\'t mean there are no servers; it just means you don\'t have to manage them. Platforms like AWS Lambda and Vercel Functions handle all the infrastructure for you, allowing you to focus on writing code.</p><p>This article dives into the core concepts, common use cases, and potential pitfalls of adopting a serverless-first mindset.</p>',
        likes: 152,
        likedBy: ['fb-12345'],
      },
    ];
    const item = baseContent[i % baseContent.length];
    const uniqueId = `${item.id}-${Math.floor(i / baseContent.length)}`;
    return {
        ...item,
        id: uniqueId,
        slug: `${item.slug}-${Math.floor(i / baseContent.length)}`,
        title: `${item.title} (Part ${Math.floor(i / baseContent.length) + 1})`,
        imageUrl: `https://picsum.photos/seed/${item.category}${i}/600/400`,
        likes: Math.floor(Math.random() * 300),
        likedBy: Math.random() > 0.5 ? ['fb-12345'] : [],
        comments: generateComments(item.id), // Add some comments to the base articles
    }
});


const mainUser = {
    id: 'fb-12345',
    name: 'Alex Johnson',
    profilePictureUrl: 'https://picsum.photos/seed/alex/100/100',
};

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'conv-1',
        participants: [mainUser, MOCK_USERS[1]],
        messages: [
            { id: 'msg-1', sender: MOCK_USERS[1], text: 'Hey Alex! Did you see the latest article on Tailwind CSS? Thought you might like it.', timestamp: '2024-03-15T10:00:00Z' },
            { id: 'msg-2', sender: mainUser, text: 'Oh hey Bella! No, I haven\'t. Send it over!', timestamp: '2024-03-15T10:01:00Z' },
            { id: 'msg-3', sender: MOCK_USERS[1], text: 'Here it is: [link to article]. The section on custom theming is really good.', timestamp: '2024-03-15T10:02:00Z' },
        ],
    },
    {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    }, {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    },
     {
        id: 'conv-2',
        participants: [mainUser, MOCK_USERS[2]],
        messages: [
            { id: 'msg-4', sender: MOCK_USERS[2], text: 'Morning Alex, I\'m working on integrating TypeScript into our new project. Do you have a minute to look over my PR?', timestamp: '2024-03-14T09:30:00Z' },
            { id: 'msg-5', sender: mainUser, text: 'Hey Charlie, sure. I\'ll take a look this afternoon.', timestamp: '2024-03-14T09:35:00Z' },
        ],
    }
];
