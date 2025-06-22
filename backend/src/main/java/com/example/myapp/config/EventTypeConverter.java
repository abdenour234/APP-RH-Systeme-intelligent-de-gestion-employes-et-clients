package com.example.myapp.config;

import com.example.myapp.model.EventType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EventTypeConverter implements AttributeConverter<EventType, String> {

    @Override
    public String convertToDatabaseColumn(EventType type) {
        if (type == null) {
            return null;
        }
        return type.getDisplayName();
    }

    @Override
    public EventType convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return EventType.fromDisplayName(dbData);
    }
} 