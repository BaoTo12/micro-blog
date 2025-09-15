package com.chibao.micro_blog.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(
        name = "post",
        indexes = {
                @Index(name = "idx_post_author_created", columnList = "author_id, created_at"),
                @Index(name = "idx_post_created", columnList = "created_at"),
        }
)
@Getter
@Setter
@NoArgsConstructor
@DynamicInsert
@DynamicUpdate
public class Post extends AbstractEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    User author;

    @Column(nullable = false, columnDefinition = "TEXT")
    String content;

    @Column(name = "like_count", nullable = false, columnDefinition = "integer default 0")
    Integer likeCount = 0;

    @Column(name = "comment_count", nullable = false, columnDefinition = "integer default 0")
    Integer commentCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20, columnDefinition = "varchar(20) default 'PUBLIC'")
    Visibility visibility = Visibility.PUBLIC;

    // Relationships
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<PostLike> likes = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<Comment> comments = new ArrayList<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "post_hashtag",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "hashtag_id")
    )
    Set<Hashtag> hashtags = new HashSet<>();

    public enum Visibility {
        PUBLIC, PRIVATE, UNLISTED
    }
}
