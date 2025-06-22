package com.example.myapp.model;

import jakarta.persistence.*;
import com.example.myapp.config.ProjectStatusConverter;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Integer projectId;
    
    @Column(name = "project_name", nullable = false)
    private String projectName;
    
    @Column(name = "client_id", nullable = false)
    private Integer clientId;
    
    @Column(name = "department_id", nullable = false)
    private Integer departmentId;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(name = "chef_id", nullable = false)
    private Integer chefId;
    
    @Convert(converter = ProjectStatusConverter.class)
    @Column(name = "status", nullable = false)
    private ProjectStatus status = ProjectStatus.Pending;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "due_at")
    private LocalDate dueAt;
    
    @ManyToOne
    @JoinColumn(name = "client_id", insertable = false, updatable = false)
    @JsonBackReference
    private Client client;
    
    @ManyToOne
    @JoinColumn(name = "department_id", insertable = false, updatable = false)
    @JsonBackReference
    private Department department;
    
    @ManyToOne
    @JoinColumn(name = "chef_id", insertable = false, updatable = false)
    @JsonBackReference
    private Employee chef;
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Task> tasks;
    
    // Constructors
    public Project() {}
    
    public Project(String projectName, Integer clientId, Integer departmentId, 
                  LocalDate startDate, Integer chefId) {
        this.projectName = projectName;
        this.clientId = clientId;
        this.departmentId = departmentId;
        this.startDate = startDate;
        this.chefId = chefId;
    }
    
    // Getters and Setters
    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }
    
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
    
    public Integer getClientId() { return clientId; }
    public void setClientId(Integer clientId) { this.clientId = clientId; }
    
    public Integer getDepartmentId() { return departmentId; }
    public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public Integer getChefId() { return chefId; }
    public void setChefId(Integer chefId) { this.chefId = chefId; }
    
    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDate getDueAt() { return dueAt; }
    public void setDueAt(LocalDate dueAt) { this.dueAt = dueAt; }
    
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    
    public Employee getChef() { return chef; }
    public void setChef(Employee chef) { this.chef = chef; }
    
    public List<Task> getTasks() { return tasks; }
    public void setTasks(List<Task> tasks) { this.tasks = tasks; }
}


