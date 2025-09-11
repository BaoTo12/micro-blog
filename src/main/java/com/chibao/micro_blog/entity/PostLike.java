package com.chibao.micro_blog.entity;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "post_like")
public class PostLike extends AbstractEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Table(uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "user_id"}))
    public static class PostLikeConstraints {}
}
