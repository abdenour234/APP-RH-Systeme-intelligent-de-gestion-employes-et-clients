package com.example.myapp.config;

import com.example.myapp.model.TicketStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TicketStatusConverter implements AttributeConverter<TicketStatus, String> {

    @Override
    public String convertToDatabaseColumn(TicketStatus status) {
        if (status == null) {
            return null;
        }
        return status.getDisplayName();
    }

    @Override
    public TicketStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return TicketStatus.fromDisplayName(dbData);
    }
} 