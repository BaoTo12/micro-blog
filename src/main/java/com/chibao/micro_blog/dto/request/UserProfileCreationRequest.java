package com.chibao.micro_blog.dto.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserProfileCreationRequest {
    Long userId;

    String displayName;

    String bio;

    String avatarUrl;

    String location;
}
