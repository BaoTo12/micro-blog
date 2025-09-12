package com.chibao.micro_blog.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_post")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SavedPost {

    @EmbeddedId
    SavedPostId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("postId")
    @JoinColumn(name = "post_id")
    Post post;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    LocalDateTime createdAt;

    @Embeddable
    public static class SavedPostId implements Serializable {
        @Column(name = "user_id")
        Long userId;

        @Column(name = "post_id")
        Long postId;
    }
}
