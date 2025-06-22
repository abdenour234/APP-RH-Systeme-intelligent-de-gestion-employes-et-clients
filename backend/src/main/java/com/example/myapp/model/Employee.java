package com.example.myapp.model;

import jakarta.persistence.*;
import com.example.myapp.config.EmployeeStatusConverter;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @Column(name = "employee_id")
    private Integer employeeId;
    
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @Column(name = "email", nullable = false)
    private String email;
    
    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;
    
    @Column(name = "department_id")
    private Integer departmentId;
    
    @Column(name = "job_title", nullable = false)
    private String jobTitle;
    
    @Column(name = "manager_id")
    private Integer managerId;
    
    @Convert(converter = EmployeeStatusConverter.class)
    @Column(name = "status", nullable = false)
    private EmployeeStatus status = EmployeeStatus.Active;
    
    @Column(name = "age")
    private Integer age;
    
    @Column(name = "sexe")
    private String sexe;
    
    @ManyToOne
    @JoinColumn(name = "department_id", insertable = false, updatable = false)
    @JsonBackReference
    private Department department;
    
    @ManyToOne
    @JoinColumn(name = "manager_id", insertable = false, updatable = false)
    @JsonBackReference
    private Employee manager;
    
    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Employee> subordinates;
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Contract> contracts;
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Task> tasks;
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Ticket> tickets;
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<EmployeeHistory> history;
    
    // Constructors
    public Employee() {}
    
    public Employee(String firstName, String lastName, String email, LocalDate hireDate, 
                   String jobTitle, Integer departmentId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.hireDate = hireDate;
        this.jobTitle = jobTitle;
        this.departmentId = departmentId;
    }
    
    // Getters and Setters
    public Integer getEmployeeId() { return employeeId; }
    public void setEmployeeId(Integer employeeId) { this.employeeId = employeeId; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public LocalDate getHireDate() { return hireDate; }
    public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }
    
    public Integer getDepartmentId() { return departmentId; }
    public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }
    
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    
    public Integer getManagerId() { return managerId; }
    public void setManagerId(Integer managerId) { this.managerId = managerId; }
    
    public EmployeeStatus getStatus() { return status; }
    public void setStatus(EmployeeStatus status) { this.status = status; }
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    
    public String getSexe() { return sexe; }
    public void setSexe(String sexe) { this.sexe = sexe; }
    
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    
    public Employee getManager() { return manager; }
    public void setManager(Employee manager) { this.manager = manager; }
    
    public List<Employee> getSubordinates() { return subordinates; }
    public void setSubordinates(List<Employee> subordinates) { this.subordinates = subordinates; }
    
    public List<Contract> getContracts() { return contracts; }
    public void setContracts(List<Contract> contracts) { this.contracts = contracts; }
    
    public List<Task> getTasks() { return tasks; }
    public void setTasks(List<Task> tasks) { this.tasks = tasks; }
    
    public List<Ticket> getTickets() { return tickets; }
    public void setTickets(List<Ticket> tickets) { this.tickets = tickets; }
    
    public List<EmployeeHistory> getHistory() { return history; }
    public void setHistory(List<EmployeeHistory> history) { this.history = history; }
}

