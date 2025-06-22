package com.example.myapp.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "clients")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_id")
    private Integer clientId;
    
    @Column(name = "client_name", nullable = false)
    private String clientName;
    
    @Column(name = "contact_person", nullable = false)
    private String contactPerson;
    
    @Column(name = "email", nullable = false)
    private String email;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "contract_date")
    private LocalDateTime contractDate;
    
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Project> projects;
    
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Ticket> tickets;
    
    // Constructors
    public Client() {}
    
    public Client(String clientName, String contactPerson, String email, String phone) {
        this.clientName = clientName;
        this.contactPerson = contactPerson;
        this.email = email;
        this.phone = phone;
        this.contractDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Integer getClientId() { return clientId; }
    public void setClientId(Integer clientId) { this.clientId = clientId; }
    
    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    
    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public LocalDateTime getContractDate() { return contractDate; }
    public void setContractDate(LocalDateTime contractDate) { this.contractDate = contractDate; }
    
    public List<Project> getProjects() { return projects; }
    public void setProjects(List<Project> projects) { this.projects = projects; }
    
    public List<Ticket> getTickets() { return tickets; }
    public void setTickets(List<Ticket> tickets) { this.tickets = tickets; }
}

