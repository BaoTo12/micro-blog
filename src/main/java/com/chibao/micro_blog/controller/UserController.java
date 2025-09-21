package com.chibao.micro_blog.controller;

import com.chibao.micro_blog.dto.request.UserCreationRequest;
import com.chibao.micro_blog.dto.response.ApiResponse;
import com.chibao.micro_blog.entity.User;
import com.chibao.micro_blog.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User", description = "APIs for managing users")
@RestController
@RequestMapping("/users")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class UserController {
    UserService userService;

    @PostMapping
    @Operation(summary = "Create a new user")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input")
    })
    public ApiResponse<String> createUser(@Valid @RequestBody UserCreationRequest request){
        userService.createUser(request);
        return ApiResponse.<String>builder()
                .result("Created User Successfully")
                .build();
    }

}
