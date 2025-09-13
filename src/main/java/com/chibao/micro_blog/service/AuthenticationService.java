package com.chibao.micro_blog.service;

import com.chibao.micro_blog.dto.request.LoginRequest;

public interface AuthenticationService {
    String authenticate(LoginRequest request);
}
