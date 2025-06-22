package com.example.myapp.model;

import jakarta.persistence.*;
import com.example.myapp.config.TaskStatusConverter;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Integer taskId;
    
    @Column(name = "project_id", nullable = false)
    private Integer projectId;
    
    @Column(name = "employee_id", nullable = false)
    private Integer employeeId;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private TaskPriority priority = TaskPriority.Medium;
    
    @Convert(converter = TaskStatusConverter.class)
    @Column(name = "status", nullable = false)
    private TaskStatus status = TaskStatus.NOT_STARTED;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @Column(name = "assigned_date", nullable = false)
    private LocalDateTime assignedDate;
    
    @Column(name = "completed_date")
    private LocalDateTime completedDate;
    
    @ManyToOne
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    @JsonIgnore
    private Project project;
    
    @ManyToOne
    @JoinColumn(name = "employee_id", insertable = false, updatable = false)
    @JsonIgnore
    private Employee employee;
    
    // Constructors
    public Task() {}
    
    public Task(Integer projectId, Integer employeeId, String title, LocalDateTime assignedDate) {
        this.projectId = projectId;
        this.employeeId = employeeId;
        this.title = title;
        this.assignedDate = assignedDate;
    }
    
    // Getters and Setters
    public Integer getTaskId() { return taskId; }
    public void setTaskId(Integer taskId) { this.taskId = taskId; }
    
    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }
    
    public Integer getEmployeeId() { return employeeId; }
    public void setEmployeeId(Integer employeeId) { this.employeeId = employeeId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }
    
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
    
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    
    public LocalDateTime getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDateTime assignedDate) { this.assignedDate = assignedDate; }
    
    public LocalDateTime getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDateTime completedDate) { this.completedDate = completedDate; }
    
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
}
