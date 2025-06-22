package com.example.myapp.config;

import com.example.myapp.model.EmployeeStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EmployeeStatusConverter implements AttributeConverter<EmployeeStatus, String> {

    @Override
    public String convertToDatabaseColumn(EmployeeStatus status) {
        if (status == null) {
            return null;
        }
        return status.getDisplayName();
    }

    @Override
    public EmployeeStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return EmployeeStatus.fromDisplayName(dbData);
    }
} 