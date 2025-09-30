package com.chibao.micro_blog.service;

import com.chibao.micro_blog.dto.response.PostResponse;
import org.springframework.data.domain.Page;

public interface TimelineService {
    Page<PostResponse> getTimeline(int page, int size);
}
