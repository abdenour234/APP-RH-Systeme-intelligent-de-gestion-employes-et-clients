package com.example.myapp.model;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "departments")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id")
    private Integer departmentId;
    
    @Column(name = "department_name", nullable = false)
    private String departmentName;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "head_employee_id")
    private Integer headEmployeeId;
    
    @ManyToOne
    @JoinColumn(name = "head_employee_id", insertable = false, updatable = false)
    @JsonBackReference
    private Employee headEmployee;
    
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Employee> employees;
    
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Project> projects;
    
    // Constructors
    public Department() {}
    
    public Department(String departmentName, String description) {
        this.departmentName = departmentName;
        this.description = description;
    }
    
    // Getters and Setters
    public Integer getDepartmentId() { return departmentId; }
    public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }
    
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Integer getHeadEmployeeId() { return headEmployeeId; }
    public void setHeadEmployeeId(Integer headEmployeeId) { this.headEmployeeId = headEmployeeId; }
    
    public Employee getHeadEmployee() { return headEmployee; }
    public void setHeadEmployee(Employee headEmployee) { this.headEmployee = headEmployee; }
    
    public List<Employee> getEmployees() { return employees; }
    public void setEmployees(List<Employee> employees) { this.employees = employees; }
    
    public List<Project> getProjects() { return projects; }
    public void setProjects(List<Project> projects) { this.projects = projects; }
}
