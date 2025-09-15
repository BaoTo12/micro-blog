package com.chibao.micro_blog.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Table(name = "follow")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Setter
@DynamicInsert
public class Follow extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    User follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "followee_id", nullable = false)
    User followee;
}
