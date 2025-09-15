package com.chibao.micro_blog.service.impl;

import com.chibao.micro_blog.dto.request.CommentRequest;
import com.chibao.micro_blog.dto.request.PostCreationRequest;
import com.chibao.micro_blog.dto.request.PostUpdateRequest;
import com.chibao.micro_blog.dto.response.PostResponse;
import com.chibao.micro_blog.entity.Comment;
import com.chibao.micro_blog.entity.Post;
import com.chibao.micro_blog.entity.PostLike;
import com.chibao.micro_blog.entity.User;
import com.chibao.micro_blog.exception.AppException;
import com.chibao.micro_blog.exception.ErrorCode;
import com.chibao.micro_blog.mapper.PostMapper;
import com.chibao.micro_blog.repository.CommentRepository;
import com.chibao.micro_blog.repository.PostLikeRepository;
import com.chibao.micro_blog.repository.PostRepository;
import com.chibao.micro_blog.repository.UserRepository;
import com.chibao.micro_blog.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentRepository commentRepository;
    private final PostMapper postMapper;

    @Override
    @Transactional
    public PostResponse createPost(PostCreationRequest postCreationRequest, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "User not found with username: " + email));
        Post post = postMapper.toPost(postCreationRequest);
        post.setAuthor(user);
        post = postRepository.save(post);
        return postMapper.toPostResponse(post);
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponse getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Post not found with id: " + postId));
        return postMapper.toPostResponse(post);
    }

    @Override
    @Transactional
    public PostResponse updatePost(Long postId, PostUpdateRequest postUpdateRequest, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Post not found with id: " + postId));
        if (!post.getAuthor().getEmail().equals(email)) {
            throw new AccessDeniedException("You are not authorized to update this post");
        }
        postMapper.updatePostFromDto(postUpdateRequest, post);
        post = postRepository.save(post);
        return postMapper.toPostResponse(post);
    }

    @Override
    @Transactional
    public void deletePost(Long postId, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Post not found with id: " + postId));
        if (!post.getAuthor().getEmail().equals(email)) {
            throw new AccessDeniedException("You are not authorized to delete this post");
        }
        postRepository.delete(post);
    }

    @Override
    @Transactional
    public void likePost(Long postId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "User not found with username: " + email));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Post not found with id: " + postId));

        if (postLikeRepository.findByUserAndPost(user, post).isPresent()) {
            throw new AppException(ErrorCode.BAD_REQUEST, "You have already liked this post");
        }

        PostLike postLike = new PostLike();
        postLike.setUser(user);
        postLike.setPost(post);
        postLikeRepository.save(postLike);

        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);
    }

    @Override
    @Transactional
    public void unlikePost(Long postId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "User not found with username: " + email));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Post not found with id: " + postId));

        PostLike postLike = postLikeRepository.findByUserAndPost(user, post)
                .orElseThrow(() -> new AppException(ErrorCode.BAD_REQUEST, "You have not liked this post"));

        postLikeRepository.delete(postLike);

        post.setLikeCount(post.getLikeCount() - 1);
        postRepository.save(post);
    }

    @Override
    @Transactional
    public void addComment(Long postId, CommentRequest commentRequest, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "User not found with username: " + email));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Post not found with id: " + postId));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setContent(commentRequest.getText());
        commentRepository.save(comment);

        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);
    }
}
