package com.chibao.micro_blog.repository;

import com.chibao.micro_blog.entity.Follow;
import com.chibao.micro_blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByFollowerAndFollowee(User follower, User followee);
}
