package com.example.myapp.controller;

import com.example.myapp.model.Project;
import com.example.myapp.model.ProjectStatus;
import com.example.myapp.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Integer id) {
        Optional<Project> project = projectService.getProjectById(id);
        return project.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.saveProject(project);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Integer id, @RequestBody Project projectDetails) {
        Optional<Project> projOpt = projectService.getProjectById(id);
        if (projOpt.isPresent()) {
            Project project = projOpt.get();
            project.setProjectName(projectDetails.getProjectName());
            project.setDescription(projectDetails.getDescription());
            project.setStatus(projectDetails.getStatus());
            project.setEndDate(projectDetails.getEndDate());
            project.setDueAt(projectDetails.getDueAt());
            return ResponseEntity.ok(projectService.saveProject(project));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Integer id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/client/{clientId}")
    public List<Project> getProjectsByClient(@PathVariable Integer clientId) {
        return projectService.getProjectsByClient(clientId);
    }
    
    @GetMapping("/status/{status}")
    public List<Project> getProjectsByStatus(@PathVariable ProjectStatus status) {
        return projectService.getProjectsByStatus(status);
    }
    
    @GetMapping("/overdue")
    public List<Project> getOverdueProjects() {
        return projectService.getOverdueProjects();
    }
} 