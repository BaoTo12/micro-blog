package com.chibao.micro_blog.repository;

import com.chibao.micro_blog.entity.Post;
import com.chibao.micro_blog.entity.PostLike;
import com.chibao.micro_blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByUserAndPost(User user, Post post);
}
