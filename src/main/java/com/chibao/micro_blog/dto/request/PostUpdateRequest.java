package com.chibao.micro_blog.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PostUpdateRequest {

    @NotEmpty(message = "Content cannot be empty")
    @Size(max = 10000, message = "Content cannot be longer than 10,000 characters")
    private String content;
}
