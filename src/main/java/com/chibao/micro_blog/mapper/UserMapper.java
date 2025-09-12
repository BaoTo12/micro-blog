package com.chibao.micro_blog.mapper;

import com.chibao.micro_blog.dto.request.UserCreationRequest;
import com.chibao.micro_blog.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    User toUser(UserCreationRequest request);
}
