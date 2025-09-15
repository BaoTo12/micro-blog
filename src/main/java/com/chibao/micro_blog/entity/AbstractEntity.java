package com.chibao.micro_blog.entity;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@MappedSuperclass
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
public abstract class AbstractEntity extends BaseEntity {
    @LastModifiedDate
    LocalDateTime updatedAt;
}
