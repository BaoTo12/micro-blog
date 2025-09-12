package com.chibao.micro_blog.service;

import com.chibao.micro_blog.dto.request.UserCreationRequest;
import com.chibao.micro_blog.entity.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    User createUser(UserCreationRequest request);
}
