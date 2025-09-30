package com.chibao.micro_blog.controller;

import com.chibao.micro_blog.dto.request.UserProfileCreationRequest;
import com.chibao.micro_blog.dto.response.ApiResponse;
import com.chibao.micro_blog.entity.UserProfile;
import com.chibao.micro_blog.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "UserProfile", description = "APIs for managing user profiles")
@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserProfileController {
    private final UserProfileService userProfileService;

    @PostMapping
    @Operation(summary = "Create a new user profile")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User profile created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ApiResponse<UserProfile> createUserProfile(@Valid @RequestBody UserProfileCreationRequest request) {
        return ApiResponse.<UserProfile>builder()
                .result(userProfileService.createUserProfile(request))
                .build();
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get user profile by user id")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User profile found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User profile not found")
    })
    public ApiResponse<UserProfile> getUserProfile(@PathVariable("userId") Long userId) {
        return ApiResponse.<UserProfile>builder()
                .result(userProfileService.getUserProfile(userId))
                .build();
    }
}
