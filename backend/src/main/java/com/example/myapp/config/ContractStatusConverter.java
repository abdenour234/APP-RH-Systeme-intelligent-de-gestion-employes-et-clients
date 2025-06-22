package com.example.myapp.config;

import com.example.myapp.model.ContractStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ContractStatusConverter implements AttributeConverter<ContractStatus, String> {

    @Override
    public String convertToDatabaseColumn(ContractStatus status) {
        if (status == null) {
            return null;
        }
        return status.getDisplayName();
    }

    @Override
    public ContractStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return ContractStatus.fromDisplayName(dbData);
    }
} 