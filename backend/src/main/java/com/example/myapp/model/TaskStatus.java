package com.example.myapp.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TaskStatus {
    NOT_STARTED("Not Started"),
    IN_PROGRESS("In Progress"),
    Completed("Completed"),
    Blocked("Blocked");

    private final String displayName;

    TaskStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    public static TaskStatus fromDisplayName(String displayName) {
        for (TaskStatus status : values()) {
            if (status.displayName.equals(displayName)) {
                return status;
            }
        }
        throw new IllegalArgumentException("No enum constant with display name: " + displayName);
    }
} 