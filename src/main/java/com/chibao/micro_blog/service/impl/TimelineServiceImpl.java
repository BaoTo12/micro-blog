package com.chibao.micro_blog.service.impl;

import com.chibao.micro_blog.components.UserPrincipal;
import com.chibao.micro_blog.dto.response.PostResponse;
import com.chibao.micro_blog.entity.Follow;
import com.chibao.micro_blog.entity.User;
import com.chibao.micro_blog.mapper.PostMapper;
import com.chibao.micro_blog.repository.FollowRepository;
import com.chibao.micro_blog.repository.PostRepository;
import com.chibao.micro_blog.service.TimelineService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class TimelineServiceImpl implements TimelineService {

    PostRepository postRepository;
    FollowRepository followRepository;
    PostMapper postMapper;

    @Override
    public Page<PostResponse> getTimeline(int page, int size) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userPrincipal.getUser();

        List<User> followees = followRepository.findAllByFollower(currentUser)
                .stream()
                .map(Follow::getFollowee)
                .collect(Collectors.toList());
        followees.add(currentUser);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        return postRepository.findByAuthorIn(followees, pageable)
                .map(postMapper::toPostResponse);
    }
}
