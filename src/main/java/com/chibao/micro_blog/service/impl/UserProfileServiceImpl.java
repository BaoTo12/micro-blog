package com.chibao.micro_blog.service.impl;

import com.chibao.micro_blog.dto.request.UserProfileCreationRequest;
import com.chibao.micro_blog.entity.User;
import com.chibao.micro_blog.entity.UserProfile;
import com.chibao.micro_blog.exception.AppException;
import com.chibao.micro_blog.exception.ErrorCode;
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
    UserProfileMapper userProfileMapper;
    UserRepository userRepository;

    @Override
    @Transactional
    public UserProfile createUserProfile(UserProfileCreationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserProfile userProfile = userProfileMapper.toUserProfile(request);
        userProfile.setUser(user);
        return userProfileRepository.save(userProfile);
    }

    @Override
    public UserProfile getUserProfile(Long userId) {
        return userProfileRepository.findByUser_Id(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_PROFILE_NOT_FOUND));
    }
}
