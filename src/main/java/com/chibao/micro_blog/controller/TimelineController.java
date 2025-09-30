package com.chibao.micro_blog.controller;

import com.chibao.micro_blog.dto.response.ApiResponse;
import com.chibao.micro_blog.dto.response.PostResponse;
import com.chibao.micro_blog.service.TimelineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Timeline", description = "APIs for user timeline")
@RestController
@RequestMapping("/timeline")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class TimelineController {

    TimelineService timelineService;

    @GetMapping
    @Operation(summary = "Get home timeline")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Timeline retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ApiResponse<Page<PostResponse>> getTimeline(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.<Page<PostResponse>>builder()
                .result(timelineService.getTimeline(page, size))
                .build();
    }
}
