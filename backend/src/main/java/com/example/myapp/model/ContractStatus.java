package com.example.myapp.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ContractStatus {
    Active("Active"),
    Termine("Terminé"),
    Suspendu("Suspendu");

    private final String displayName;

    ContractStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    public static ContractStatus fromDisplayName(String displayName) {
        for (ContractStatus status : values()) {
            if (status.displayName.equals(displayName)) {
                return status;
            }
        }
        throw new IllegalArgumentException("No enum constant with display name: " + displayName);
    }
} 