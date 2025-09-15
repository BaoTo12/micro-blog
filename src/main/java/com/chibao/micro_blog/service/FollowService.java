package com.chibao.micro_blog.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public interface FollowService {
    void followUser(Long followeeId, UserDetails userDetails);
    void unfollowUser(Long followeeId, UserDetails userDetails);
}
