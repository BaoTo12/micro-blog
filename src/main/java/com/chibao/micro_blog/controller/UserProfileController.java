package com.chibao.micro_blog.controller;

import com.chibao.micro_blog.dto.request.UserProfileCreationRequest;
import com.chibao.micro_blog.dto.response.ApiResponse;
import com.chibao.micro_blog.entity.UserProfile;
import com.chibao.micro_blog.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService userProfileService;

    @PostMapping
    public ApiResponse<UserProfile> createUserProfile(@RequestBody UserProfileCreationRequest request) {
        return ApiResponse.<UserProfile>builder()
                .result(userProfileService.createUserProfile(request))
                .build();
    }
}
