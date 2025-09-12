package com.chibao.micro_blog.service.impl;

import com.chibao.micro_blog.dto.request.UserCreationRequest;
import com.chibao.micro_blog.entity.User;
import com.chibao.micro_blog.mapper.UserMapper;
import com.chibao.micro_blog.repository.UserRepository;
import com.chibao.micro_blog.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    UserMapper mapper;

    @Override
    public User createUser(UserCreationRequest request) {
        User user = mapper.toUser(request);
        System.out.println(user);
        return userRepository.save(user);
    }
}
