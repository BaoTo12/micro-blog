package com.chibao.micro_blog.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "user_profile")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
public class UserProfile{
    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @MapsId
    @JsonBackReference
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