package com.chibao.micro_blog.dto.request;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    String email;

    String password;

    Boolean activated;
}
