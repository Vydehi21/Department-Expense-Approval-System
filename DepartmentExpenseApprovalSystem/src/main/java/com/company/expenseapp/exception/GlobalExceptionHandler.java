package com.company.expenseapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BudgetExceededException.class)
    public ResponseEntity<Map<String, String>> handleBudgetExceeded(BudgetExceededException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "BUDGET_EXCEEDED");
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<Map<String, String>> handleUnauthorized(UnauthorizedActionException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "ACCESS_DENIED");
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN); // 👈 403 Forbidden
    }

    @ExceptionHandler(InvalidStateException.class)
    public ResponseEntity<Map<String, String>> handleInvalidState(InvalidStateException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "INVALID_STATE");
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT); // 👈 409 Conflict
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "NOT_FOUND");
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // 🛡️ Catch-all Fallback Handler to prevent leaking infrastructure details/stack traces
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "INTERNAL_ERROR");
        error.put("message", "An unexpected system error occurred. Please contact administration.");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR); // 👈 500 Internal Error
    }
}
