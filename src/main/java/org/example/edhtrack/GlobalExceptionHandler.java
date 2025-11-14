package org.example.edhtrack;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler
    public String handleException(Exception e) {
        return "Last Exceptionhandler: " + e.getMessage();
    }
}
