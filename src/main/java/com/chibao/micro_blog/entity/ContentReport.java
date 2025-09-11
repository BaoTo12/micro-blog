package com.chibao.micro_blog.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "content_report")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContentReport extends AbstractEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id")
    User reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    Post post;

    @Column(length = 255)
    String reason;

    @Column(columnDefinition = "TEXT")
    String details;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20, columnDefinition = "varchar(20) default 'OPEN'")
    Status status = Status.OPEN;

    public enum Status {
        OPEN, IN_REVIEW, RESOLVED, DISMISSED
    }
}