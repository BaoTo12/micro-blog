package com.chibao.micro_blog.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "user_profile")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfile extends AbstractEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @MapsId
    User user;

    @Column(name = "display_name", length = 100)
    String displayName;

    @Column(columnDefinition = "TEXT")
    String bio;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    String avatarUrl;

    @Column(length = 255)
    String location;
}