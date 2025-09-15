package com.chibao.micro_blog.controller;

import com.chibao.micro_blog.dto.response.ApiResponse;
import com.chibao.micro_blog.service.FollowService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users/follows")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class FollowerController {
    FollowService followService;

    @PostMapping("/{followeeId}")
    public ApiResponse<String> followUser(@PathVariable Long followeeId, @AuthenticationPrincipal UserDetails userDetails) {
        followService.followUser(followeeId, userDetails);
        return ApiResponse.<String>builder()
                .result("Followed user successfully")
                .build();
    }

    @DeleteMapping("/{followeeId}")
    public ApiResponse<String> unfollowUser(@PathVariable Long followeeId , @AuthenticationPrincipal UserDetails userDetails) {
        followService.unfollowUser(followeeId, userDetails);
        return ApiResponse.<String>builder()
                .result("Unfollowed user successfully")
                .build();
    }
}
