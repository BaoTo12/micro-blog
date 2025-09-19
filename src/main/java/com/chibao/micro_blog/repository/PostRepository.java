package com.chibao.micro_blog.repository;

import com.chibao.micro_blog.entity.Post;
import com.chibao.micro_blog.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByAuthorIn(List<User> authors, Pageable pageable);
}
