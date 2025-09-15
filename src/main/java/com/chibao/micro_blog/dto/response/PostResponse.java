package com.chibao.micro_blog.dto.response;

import com.chibao.micro_blog.entity.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostResponse {
    private Long id;
    private String content;
    private UserResponse author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
