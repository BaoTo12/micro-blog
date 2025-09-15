package com.chibao.micro_blog.service.impl;

import com.chibao.micro_blog.entity.Follow;
import com.chibao.micro_blog.entity.User;
import com.chibao.micro_blog.exception.AppException;
import com.chibao.micro_blog.exception.ErrorCode;
import com.chibao.micro_blog.repository.FollowRepository;
import com.chibao.micro_blog.repository.UserRepository;
import com.chibao.micro_blog.service.FollowService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class FollowServiceImpl implements FollowService {
    FollowRepository followRepository;
    UserRepository userRepository;

    @Override
    public void followUser(Long followeeId, UserDetails userDetails) {
        User follower = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "User not found"));
        User followee = userRepository.findById(followeeId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "User not found"));

        if (followRepository.findByFollowerAndFollowee(follower, followee).isPresent()) {
            throw new RuntimeException("You are already following this user");
        }

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowee(followee);
        log.info(String.valueOf(follow));
        followRepository.save(follow);
    }

    @Override
    public void unfollowUser(Long followeeId, UserDetails userDetails) {
        User follower = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "User not found"));
        User followee = userRepository.findById(followeeId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Follow follow = followRepository.findByFollowerAndFollowee(follower, followee)
                .orElseThrow(() -> new RuntimeException("You are not following this user"));

        followRepository.delete(follow);
    }
}
