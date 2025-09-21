package com.chibao.micro_blog.controller;

import com.chibao.micro_blog.dto.request.CommentRequest;
import com.chibao.micro_blog.dto.request.PostCreationRequest;
import com.chibao.micro_blog.dto.request.PostUpdateRequest;
import com.chibao.micro_blog.dto.response.ApiResponse;
import com.chibao.micro_blog.dto.response.PostResponse;
import com.chibao.micro_blog.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Post", description = "APIs for managing posts")
@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class PostController {

    private final PostService postService;

    @PostMapping
    @Operation(summary = "Create a new post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Post created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ResponseEntity<ApiResponse<PostResponse>> createPost(@Valid @RequestBody PostCreationRequest postCreationRequest,
                                                                @AuthenticationPrincipal UserDetails userDetails) {
        PostResponse postResponse = postService.createPost(postCreationRequest, userDetails.getUsername());
        ApiResponse<PostResponse> response =
                ApiResponse.<PostResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .message("Post created successfully")
                        .result(postResponse)
                        .build();
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{postId}")
    @Operation(summary = "Get a post by ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<PostResponse>> getPostById(@PathVariable Long postId) {
        PostResponse postResponse = postService.getPostById(postId);
        ApiResponse<PostResponse> response = new ApiResponse<>(HttpStatus.OK.value(), "Post retrieved successfully", postResponse);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{postId}")
    @Operation(summary = "Update a post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(@PathVariable Long postId,
                                                                @Valid @RequestBody PostUpdateRequest postUpdateRequest,
                                                                @AuthenticationPrincipal UserDetails userDetails) {
        PostResponse postResponse = postService.updatePost(postId, postUpdateRequest, userDetails.getUsername());
        ApiResponse<PostResponse> response = new ApiResponse<>(HttpStatus.OK.value(), "Post updated successfully", postResponse);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{postId}")
    @Operation(summary = "Delete a post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Long postId,
                                                        @AuthenticationPrincipal UserDetails userDetails) {
        postService.deletePost(postId, userDetails.getUsername());
        ApiResponse<Void> response = new ApiResponse<>(HttpStatus.OK.value(), "Post deleted successfully", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{postId}/like")
    @Operation(summary = "Like a post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post liked successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<Void>> likePost(@PathVariable Long postId,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        postService.likePost(postId, userDetails.getUsername());
        ApiResponse<Void> response = new ApiResponse<>(HttpStatus.OK.value(), "Post liked successfully", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{postId}/like")
    @Operation(summary = "Unlike a post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Post unliked successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<Void>> unlikePost(@PathVariable Long postId,
                                                        @AuthenticationPrincipal UserDetails userDetails) {
        postService.unlikePost(postId, userDetails.getUsername());
        ApiResponse<Void> response = new ApiResponse<>(HttpStatus.OK.value(), "Post unliked successfully", null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{postId}/comments")
    @Operation(summary = "Add a comment to a post")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Comment added successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Post not found")
    })
    public ResponseEntity<ApiResponse<Void>> addComment(@PathVariable Long postId,
                                                        @Valid @RequestBody CommentRequest commentRequest,
                                                        @AuthenticationPrincipal UserDetails userDetails) {
        postService.addComment(postId, commentRequest, userDetails.getUsername());
        ApiResponse<Void> response = new ApiResponse<>(HttpStatus.CREATED.value(), "Comment added successfully", null);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
