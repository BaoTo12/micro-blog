package com.chibao.micro_blog.service;

import com.chibao.micro_blog.dto.request.UserProfileCreationRequest;
import com.chibao.micro_blog.entity.UserProfile;

public interface UserProfileService {
    public UserProfile createUserProfile(UserProfileCreationRequest request);
}
