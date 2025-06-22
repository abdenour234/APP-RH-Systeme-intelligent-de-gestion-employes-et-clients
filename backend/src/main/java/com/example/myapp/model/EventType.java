package com.example.myapp.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum EventType {
    Promotion("Promotion"),
    Transfer("Transfer"),
    Burnout("Burnout"),
    Leave("Leave"),
    Other("Other");

    private final String displayName;

    EventType(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    public static EventType fromDisplayName(String displayName) {
        for (EventType type : values()) {
            if (type.displayName.equals(displayName)) {
                return type;
            }
        }
        throw new IllegalArgumentException("No enum constant with display name: " + displayName);
    }
} 