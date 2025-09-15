package com.chibao.micro_blog.exception;


import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AppException extends RuntimeException{
    private ErrorCode code;
    private String message;

    public AppException(ErrorCode code, String message) {
        this.code = code;
        this.message = message;
    }

    public AppException(String message, ErrorCode code, String message1) {
        super(message);
        this.code = code;
        this.message = message1;
    }
}
