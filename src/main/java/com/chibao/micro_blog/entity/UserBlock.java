package com.chibao.micro_blog.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "user_block")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserBlock extends AbstractEntity{
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blocker_id", nullable = false)
    User blocker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blocked_id", nullable = false)
    User blocked;

    @Table(uniqueConstraints = @UniqueConstraint(columnNames = {"blocker_id", "blocked_id"}))
    public static class UserBlockConstraints{}
}
