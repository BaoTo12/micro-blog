package com.chibao.micro_blog.entity;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "post_like")
@DynamicInsert
public class PostLike extends BaseEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Table(uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "user_id"}))
    public static class PostLikeConstraints {}
}
