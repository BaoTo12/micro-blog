package com.chibao.micro_blog.dto.request;


import lombok.Getter;

@Getter
public class LoginRequest {
    private String email;
    private String password;

}
