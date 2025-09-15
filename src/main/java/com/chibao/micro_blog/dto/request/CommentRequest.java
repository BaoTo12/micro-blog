package com.chibao.micro_blog.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentRequest {
    @NotEmpty
    @Size(max = 2000)
    private String text;
}
