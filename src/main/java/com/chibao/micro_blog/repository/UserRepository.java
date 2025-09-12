package com.chibao.micro_blog.repository;

import com.chibao.micro_blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
