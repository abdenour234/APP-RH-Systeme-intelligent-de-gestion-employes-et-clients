package com.example.myapp.config;

import com.example.myapp.model.ProjectStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ProjectStatusConverter implements AttributeConverter<ProjectStatus, String> {

    @Override
    public String convertToDatabaseColumn(ProjectStatus status) {
        if (status == null) {
            return null;
        }
        return status.getDisplayName();
    }

    @Override
    public ProjectStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return ProjectStatus.fromDisplayName(dbData);
    }
} 