package com.chibao.micro_blog.service.impl;

import com.chibao.micro_blog.dto.request.UserProfileCreationRequest;
import com.chibao.micro_blog.entity.User;
import com.chibao.micro_blog.entity.UserProfile;
import com.chibao.micro_blog.mapper.UserProfileMapper;
import com.chibao.micro_blog.repository.UserProfileRepository;
import com.chibao.micro_blog.repository.UserRepository;
import com.chibao.micro_blog.service.UserProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserProfileServiceImpl implements UserProfileService {
    UserProfileRepository userProfileRepository;
    UserProfileMapper mapper;
    UserRepository userRepository;

    @Override
    @Transactional
    public UserProfile createUserProfile(UserProfileCreationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile userProfile = mapper.toUserProfile(request);
        userProfile.setUser(user);
        return userProfileRepository.save(userProfile);
    }
}
