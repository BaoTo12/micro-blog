package com.chibao.micro_blog.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Hashtag extends AbstractEntity{

    @Column(nullable = false, length = 100)
    String tag;

    @Column(name = "normalized_tag", nullable = false, length = 100, unique = true)
    String normalizedTag;

    @ManyToMany(mappedBy = "hashtags")
    Set<Post> posts = new HashSet<>();
}
