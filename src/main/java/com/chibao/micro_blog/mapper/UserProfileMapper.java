package com.chibao.micro_blog.mapper;

import com.chibao.micro_blog.dto.request.UserProfileCreationRequest;
import com.chibao.micro_blog.entity.User;
import com.chibao.micro_blog.entity.UserProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserProfileMapper {
    @Mapping(target = "user", source = "userId", qualifiedByName = "mapUser")
    UserProfile toUserProfile(UserProfileCreationRequest request);

    @Named("mapUser")
    default User map(Long userId) {
        if (userId == null) return null;
        User u = new User();
        u.setId(userId);
        return u;
    }
}
