package com.chibao.micro_blog.entity;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.Type;

import java.util.Map;

@Entity
@Table(name = "notification")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification extends AbstractEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    User recipient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    User actor;

    @Column(nullable = false, length = 50)
    String type; // LIKE, FOLLOW, COMMENT, MENTION, SYSTEM

    @Column(name = "object_type", length = 50)
    String objectType;

    @Column(name = "object_id")
    Long objectId;

    @Type(JsonType.class) // Tells Hibernate: "Use JsonType converter"
    @Column(columnDefinition = "JSONB") // Tells DB: "Store as JSONB column"
    Map<String, Object> payload;

    @Column(name = "is_read", nullable = false, columnDefinition = "boolean default false")
    Boolean isRead = false;
}
