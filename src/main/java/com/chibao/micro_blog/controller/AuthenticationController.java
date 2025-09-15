package com.chibao.micro_blog.controller;


import com.chibao.micro_blog.dto.request.LoginRequest;
import com.chibao.micro_blog.dto.request.UserCreationRequest;
import com.chibao.micro_blog.dto.response.ApiResponse;
import com.chibao.micro_blog.service.AuthenticationService;
import com.chibao.micro_blog.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    UserService userService;
    AuthenticationService authenticationService;

    @PostMapping("/login")
    public ApiResponse<String> login(@RequestBody LoginRequest request){
        return ApiResponse.<String>builder()
                .result(authenticationService.authenticate(request))
                .build();
    }

    @PostMapping("/register")
    public ApiResponse<String> createUser(@RequestBody UserCreationRequest request){
        userService.createUser(request);
        return ApiResponse.<String>builder()
                .result("Created User Successfully")
                .build();
    }
}
