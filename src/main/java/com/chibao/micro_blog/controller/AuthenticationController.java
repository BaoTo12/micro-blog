package com.chibao.micro_blog.controller;


import com.chibao.micro_blog.dto.request.LoginRequest;
import com.chibao.micro_blog.dto.request.UserCreationRequest;
import com.chibao.micro_blog.dto.response.ApiResponse;
import com.chibao.micro_blog.service.AuthenticationService;
import com.chibao.micro_blog.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Authentication", description = "APIs for authentication")
@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    UserService userService;
    AuthenticationService authenticationService;

    @PostMapping("/login")
    @Operation(summary = "User login")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login successful"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ApiResponse<String> login(@RequestBody LoginRequest request){
        return ApiResponse.<String>builder()
                .result(authenticationService.authenticate(request))
                .build();
    }

    @PostMapping("/register")
    @Operation(summary = "User registration")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ApiResponse<String> createUser(@RequestBody UserCreationRequest request){
        userService.createUser(request);
        return ApiResponse.<String>builder()
                .result("Created User Successfully")
                .build();
    }
}
