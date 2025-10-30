# Micro-Blog

This is a micro-blogging application that allows users to create posts, follow other users, and view a timeline of posts from the users they follow.

## Features

*   User authentication (registration and login)
*   Create, read, update, and delete posts
*   Like and unlike posts
*   Comment on posts
*   Follow and unfollow users
*   View a personalized timeline
*   User profiles

## Technologies Used

### Backend

*   Java 21
*   Spring Boot 3.5.5
*   Spring Security
*   Spring Data JPA
*   PostgreSQL
*   Flyway
*   JWT for authentication
*   MapStruct
*   Lombok
*   SpringDoc (for OpenAPI documentation)

### Frontend

*   React
*   Vite
*   TypeScript
*   React Router

## Getting Started

### Prerequisites

*   Java 21
*   Maven
*   Node.js and npm
*   PostgreSQL

### Backend Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/micro-blog.git
    cd micro-blog
    ```
2.  Create a PostgreSQL database named `micro_blog`.
3.  Configure the database connection in `src/main/resources/application.yml`.
4.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
    The backend will be running on `http://localhost:8080`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd micro-blog-frontend-main
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Run the frontend application:
    ```bash
    npm run dev
    ```
    The frontend will be running on `http://localhost:5173`.

## Project Structure

```
.
├── .git
├── .github
├── .mvn
├── docs
├── micro-blog-frontend-main
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   └── services
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.json
│   └── vite.config.ts
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── chibao
│   │   │           └── micro_blog
│   │   │               ├── components
│   │   │               ├── config
│   │   │               ├── controller
│   │   │               ├── dto
│   │   │               ├── entity
│   │   │               ├── exception
│   │   │               ├── mapper
│   │   │               ├── repository
│   │   │               └── service
│   │   └── resources
│   │       ├── db
│   │       │   └── migration
│   │       └── application.yml
│   └── test
├── .gitignore
├── mvnw
├── mvnw.cmd
└── pom.xml
```

## API Endpoints

### Authentication

*   `POST /auth/login`: User login.
*   `POST /auth/register`: User registration.

### Users

*   `GET /users/{userId}`: Get user by id.
*   `DELETE /users/{userId}`: Deactivate user by id.
*   `POST /users/follows/{followeeId}`: Follow a user.
*   `DELETE /users/follows/{followeeId}`: Unfollow a user.

### Profiles

*   `POST /profiles`: Create a new user profile.
*   `GET /profiles/{userId}`: Get user profile by user id.

### Posts

*   `POST /posts`: Create a new post.
*   `GET /posts/{postId}`: Get a post by ID.
*   `PUT /posts/{postId}`: Update a post.
*   `DELETE /posts/{postId}`: Delete a post.
*   `POST /posts/{postId}/like`: Like a post.
*   `DELETE /posts/{postId}/like`: Unlike a post.
*   `POST /posts/{postId}/comments`: Add a comment to a post.

### Timeline

*   `GET /timeline`: Get home timeline.

## Database Schema

The database schema is managed using Flyway. The schema includes tables for:

*   `users`: Core user table.
*   `post`: Table for posts.
*   `follow`: Table to store follower/followee relationships.
*   `post_like`: Table to store likes on posts.
*   `comment`: Table for comments on posts.
*   `user_profile`: Table for user profile information.
*   `saved_post`: Table for bookmarked posts.
*   `hashtag`: Table for hashtags.
*   `post_hashtag`: Join table for posts and hashtags.
*   `notification`: Table for user notifications.
*   `user_block`: Table to store blocked user relationships.
*   `content_report`: Table for content moderation.
*   `user_feed`: Table for durable user feed storage.

For more details, see `src/main/resources/db/migration/V1__init_schema.sql`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.
