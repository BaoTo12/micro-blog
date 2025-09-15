package com.chibao.micro_blog.controller;

import com.chibao.micro_blog.dto.request.UserCreationRequest;
import com.chibao.micro_blog.dto.response.ApiResponse;
import com.chibao.micro_blog.entity.User;
import com.chibao.micro_blog.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class UserController {
    UserService userService;

    @PostMapping
    public ApiResponse<String> createUser(@RequestBody UserCreationRequest request){
        userService.createUser(request);
        return ApiResponse.<String>builder()
                .result("Created User Successfully")
                .build();
    }

}
