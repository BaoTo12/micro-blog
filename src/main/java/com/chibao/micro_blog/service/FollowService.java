package com.chibao.micro_blog.service;

import org.springframework.stereotype.Service;

@Service
public interface FollowService {
    void followUser(Long followeeId);
    void unfollowUser(Long followeeId);
}
