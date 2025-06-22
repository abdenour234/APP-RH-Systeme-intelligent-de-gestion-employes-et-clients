package com.example.myapp.config;

import com.example.myapp.model.ContractType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ContractTypeConverter implements AttributeConverter<ContractType, String> {

    @Override
    public String convertToDatabaseColumn(ContractType type) {
        if (type == null) {
            return null;
        }
        return type.getDisplayName();
    }

    @Override
    public ContractType convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return ContractType.fromDisplayName(dbData);
    }
} 