package com.example.myapp.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ProjectStatus {
    Pending("Pending"),
    IN_PROGRESS("In Progress"),
    Completed("Completed"),
    Cancelled("Cancelled");

    private final String displayName;

    ProjectStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    public static ProjectStatus fromDisplayName(String displayName) {
        for (ProjectStatus status : values()) {
            if (status.displayName.equals(displayName)) {
                return status;
            }
        }
        throw new IllegalArgumentException("No enum constant with display name: " + displayName);
    }
} 