package com.example.myapp.service;

import com.example.myapp.model.Project;
import com.example.myapp.model.ProjectStatus;
import com.example.myapp.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Project> getProjectById(Integer id) {
        return projectRepository.findById(id);
    }
    
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }
    
    public void deleteProject(Integer id) {
        projectRepository.deleteById(id);
    }
    
    public List<Project> searchProjectsByName(String name) {
        return projectRepository.findByProjectNameContainingIgnoreCase(name);
    }
    
    public List<Project> getProjectsByClient(Integer clientId) {
        return projectRepository.findByClientId(clientId);
    }
    
    public List<Project> getProjectsByDepartment(Integer departmentId) {
        return projectRepository.findByDepartmentId(departmentId);
    }
    
    public List<Project> getProjectsByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }
    
    public List<Project> getOverdueProjects() {
        return projectRepository.findOverdueProjects(LocalDate.now());
    }
} 