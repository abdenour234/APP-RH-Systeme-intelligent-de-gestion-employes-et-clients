package com.example.myapp.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.myapp.config.TicketStatusConverter;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private Integer ticketId;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", nullable = false)
    private String description;
    
    @Column(name = "client_id")
    private Integer clientId;
    
    @Column(name = "employee_id", nullable = false)
    private Integer employeeId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private TicketPriority priority = TicketPriority.Medium;
    
    @Convert(converter = TicketStatusConverter.class)
    @Column(name = "status", nullable = false)
    private TicketStatus status = TicketStatus.Open;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @ManyToOne
    @JoinColumn(name = "client_id", insertable = false, updatable = false)
    @JsonIgnore
    private Client client;
    
    @ManyToOne
    @JoinColumn(name = "employee_id", insertable = false, updatable = false)
    @JsonIgnore
    private Employee employee;
    
    // Constructors
    public Ticket() {}
    
    public Ticket(String title, String description, Integer employeeId) {
        this.title = title;
        this.description = description;
        this.employeeId = employeeId;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Integer getTicketId() { return ticketId; }
    public void setTicketId(Integer ticketId) { this.ticketId = ticketId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Integer getClientId() { return clientId; }
    public void setClientId(Integer clientId) { this.clientId = clientId; }
    
    public Integer getEmployeeId() { return employeeId; }
    public void setEmployeeId(Integer employeeId) { this.employeeId = employeeId; }
    
    public TicketPriority getPriority() { return priority; }
    public void setPriority(TicketPriority priority) { this.priority = priority; }
    
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
}

