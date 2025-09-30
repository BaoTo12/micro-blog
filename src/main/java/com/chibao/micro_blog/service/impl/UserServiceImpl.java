package com.chibao.micro_blog.service.impl;

import com.chibao.micro_blog.dto.request.UserCreationRequest;
import com.chibao.micro_blog.dto.response.UserResponse;
import com.chibao.micro_blog.entity.User;
import com.chibao.micro_blog.exception.AppException;
import com.chibao.micro_blog.exception.ErrorCode;
import com.chibao.micro_blog.mapper.UserMapper;
import com.chibao.micro_blog.repository.UserRepository;
import com.chibao.micro_blog.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    @Override
    public User createUser(UserCreationRequest request) {
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        System.out.println(user);
        return userRepository.save(user);
    }

    @Override
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    @Override
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setActivated(false);
        userRepository.save(user);
    }

    @Override
    public UserResponse getCurrentUser() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByEmail(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toUserResponse(user);
    }
}
