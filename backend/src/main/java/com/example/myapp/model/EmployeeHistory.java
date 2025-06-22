package com.example.myapp.model;

import jakarta.persistence.*;
import com.example.myapp.config.EventTypeConverter;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "employee_history")
public class EmployeeHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Integer historyId;
    
    @Column(name = "employee_id", nullable = false)
    private Integer employeeId;
    
    @Convert(converter = EventTypeConverter.class)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;
    
    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;
    
    @ManyToOne
    @JoinColumn(name = "employee_id", insertable = false, updatable = false)
    @JsonIgnore
    private Employee employee;
    
    // Constructors
    public EmployeeHistory() {}
    
    public EmployeeHistory(Integer employeeId, EventType eventType, LocalDate eventDate) {
        this.employeeId = employeeId;
        this.eventType = eventType;
        this.eventDate = eventDate;
    }
    
    // Getters and Setters
    public Integer getHistoryId() { return historyId; }
    public void setHistoryId(Integer historyId) { this.historyId = historyId; }
    
    public Integer getEmployeeId() { return employeeId; }
    public void setEmployeeId(Integer employeeId) { this.employeeId = employeeId; }
    
    public EventType getEventType() { return eventType; }
    public void setEventType(EventType eventType) { this.eventType = eventType; }
    
    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
}
