package com.chibao.micro_blog.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@DynamicInsert
public class Comment extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "post_id")
    Post post;

    @OneToOne
    @JoinColumn(name = "author_id")
    User user;

    String content;
}
