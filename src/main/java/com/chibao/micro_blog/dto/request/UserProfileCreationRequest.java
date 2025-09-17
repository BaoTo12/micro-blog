package com.chibao.micro_blog.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserProfileCreationRequest {
    @NotNull(message = "User ID is required")
    Long userId;

    @NotEmpty(message = "Display name is required")
    @Size(max = 50, message = "Display name cannot be longer than 50 characters")
    String displayName;

    @Size(max = 200, message = "Bio cannot be longer than 200 characters")
    String bio;

    String avatarUrl;

    String location;
}
