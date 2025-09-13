package com.chibao.micro_blog.repository;

import com.chibao.micro_blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u.activated FROM User u WHERE u.email = :email")
    Optional<Boolean> isActivated(@Param("email") String email);
}
