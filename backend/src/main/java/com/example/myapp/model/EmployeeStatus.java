package com.example.myapp.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum EmployeeStatus {
    Active("Active"),
    Inactive("Inactive"),
    ON_LEAVE("On Leave");

    private final String displayName;

    EmployeeStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    public static EmployeeStatus fromDisplayName(String displayName) {
        for (EmployeeStatus status : values()) {
            if (status.displayName.equals(displayName)) {
                return status;
            }
        }
        throw new IllegalArgumentException("No enum constant with display name: " + displayName);
    }
} 