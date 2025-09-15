package com.chibao.micro_blog.dto.response;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String email;
    private String displayName; // if you want from UserProfile
}
