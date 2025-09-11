package com.chibao.micro_blog.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_feed")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserFeed {

    @EmbeddedId
    UserFeedId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("postId")
    @JoinColumn(name = "post_id")
    Post post;

    @Column(nullable = false)
    Long score; // epoch millis for ordering

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @Embeddable
    public static class UserFeedId implements Serializable {
        @Column(name = "user_id")
        Long userId;

        @Column(name = "post_id")
        Long postId;
    }
}