package com.example.myapp.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TicketStatus {
    Open("Open"),
    IN_PROGRESS("In Progress"),
    Resolved("Resolved"),
    Closed("Closed"),
    Reopened("Reopened");

    private final String displayName;

    TicketStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    public static TicketStatus fromDisplayName(String displayName) {
        for (TicketStatus status : values()) {
            if (status.displayName.equals(displayName)) {
                return status;
            }
        }
        throw new IllegalArgumentException("No enum constant with display name: " + displayName);
    }
} 