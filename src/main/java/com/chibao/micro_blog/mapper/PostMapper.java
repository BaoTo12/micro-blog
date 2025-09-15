package com.chibao.micro_blog.mapper;

import com.chibao.micro_blog.dto.request.PostCreationRequest;
import com.chibao.micro_blog.dto.request.PostUpdateRequest;
import com.chibao.micro_blog.dto.response.PostResponse;
import com.chibao.micro_blog.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PostMapper {

    Post toPost(PostCreationRequest request);

    @Mapping(target = "author", source = "author")
    PostResponse toPostResponse(Post post);

    void updatePostFromDto(PostUpdateRequest postUpdateRequest, @MappingTarget Post post);
}
