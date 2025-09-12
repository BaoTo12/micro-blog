package com.chibao.micro_blog.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;

import java.util.List;

@Entity
@Setter
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "users")
@ToString
@DynamicInsert
public class User extends AbstractEntity {
    String email;

    String password;

    Boolean activated;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    List<Post> posts;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    UserProfile userProfile;
}
