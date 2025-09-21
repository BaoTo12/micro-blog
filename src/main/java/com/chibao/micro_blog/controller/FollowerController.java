package com.chibao.micro_blog.controller;

import com.chibao.micro_blog.dto.response.ApiResponse;
import com.chibao.micro_blog.service.FollowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@Tag(name = "Follow", description = "APIs for following and unfollowing users")
@RestController
@RequestMapping("/users/follows")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class FollowerController {
    FollowService followService;

    @PostMapping("/{followeeId}")
    @Operation(summary = "Follow a user")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Followed user successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found")
    })
    public ApiResponse<String> followUser(@PathVariable Long followeeId, @AuthenticationPrincipal UserDetails userDetails) {
        followService.followUser(followeeId, userDetails);
        return ApiResponse.<String>builder()
                .result("Followed user successfully")
                .build();
    }

    @DeleteMapping("/{followeeId}")
    @Operation(summary = "Unfollow a user")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Unfollowed user successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found")
    })
    public ApiResponse<String> unfollowUser(@PathVariable Long followeeId, @AuthenticationPrincipal UserDetails userDetails) {
        followService.unfollowUser(followeeId, userDetails);
        return ApiResponse.<String>builder()
                .result("Unfollowed user successfully")
                .build();
    }
}
