package com.realestatecrm.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationErrorResponse {
    private boolean success;
    private String message;
    private LocalDateTime timestamp;
    private String path;
    private Map<String, String> errors;
}
