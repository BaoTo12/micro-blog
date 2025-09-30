package com.chibao.micro_blog.exception;


import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AppException extends RuntimeException{
    private ErrorCode code;
    private String message;

    public AppException(ErrorCode code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    public AppException(ErrorCode code) {
        super(code.name());
        this.code = code;
        this.message = code.name();
    }
}
