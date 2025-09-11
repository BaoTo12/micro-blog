package com.chibao.micro_blog.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Comment extends AbstractEntity {

    @OneToOne
    @JoinColumn(name = "post_id")
    Post post;

    @OneToOne
    @JoinColumn(name = "user_id")
    User user;

    String content;
}
