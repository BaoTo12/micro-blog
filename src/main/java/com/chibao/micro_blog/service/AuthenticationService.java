package com.chibao.micro_blog.service;

import com.chibao.micro_blog.dto.request.LoginRequest;
import com.chibao.micro_blog.entity.User;

public interface AuthenticationService {
    String authenticate(LoginRequest request);

}
