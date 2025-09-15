package com.chibao.micro_blog.service;

import com.chibao.micro_blog.dto.request.PostCreationRequest;
import com.chibao.micro_blog.dto.request.PostUpdateRequest;
import com.chibao.micro_blog.dto.response.PostResponse;
import com.chibao.micro_blog.dto.request.CommentRequest;

public interface PostService {
    PostResponse createPost(PostCreationRequest postCreationRequest, String username);

    PostResponse getPostById(Long postId);

    PostResponse updatePost(Long postId, PostUpdateRequest postUpdateRequest, String username);

    void deletePost(Long postId, String username);

    void likePost(Long postId, String username);

    void unlikePost(Long postId, String username);

    void addComment(Long postId, CommentRequest commentRequest, String username);
}
