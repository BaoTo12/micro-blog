package com.chibao.micro_blog.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    RESOURCE_NOT_FOUND(1111, HttpStatus.NOT_FOUND);

    private final int code;
    private final HttpStatusCode statusCode;

    ErrorCode(Integer code, HttpStatusCode statusCode) {
        this.code = code;
        this.statusCode = statusCode;
    }
    }
