package com.example.myapp.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ContractType {
    CDI("CDI"),
    CDD("CDD"),
    Freelance("Freelance"),
    Stage("Stage"),
    Alternance("Alternance");

    private final String displayName;

    ContractType(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    public static ContractType fromDisplayName(String displayName) {
        for (ContractType type : values()) {
            if (type.displayName.equals(displayName)) {
                return type;
            }
        }
        throw new IllegalArgumentException("No enum constant with display name: " + displayName);
    }
} 