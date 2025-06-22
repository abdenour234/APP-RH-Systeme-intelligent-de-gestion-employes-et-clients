package com.example.myapp.model;

import jakarta.persistence.*;
import com.example.myapp.config.ContractStatusConverter;
import com.example.myapp.config.ContractTypeConverter;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "contracts")
public class Contract {
    @Id
    @Column(name = "contract_id")
    private Integer contractId;
    
    @Column(name = "employee_id", nullable = false)
    private Integer employeeId;
    
    @Convert(converter = ContractTypeConverter.class)
    @Column(name = "contract_type", nullable = false)
    private ContractType contractType;
    
    @Column(name = "work_hours", nullable = false)
    private Integer workHours;
    
    @Column(name = "salary", nullable = false)
    private BigDecimal salary;
    
    @Column(name = "remote_available", nullable = false)
    private Boolean remoteAvailable;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(name = "benefits")
    private String benefits;
    
    @Convert(converter = ContractStatusConverter.class)
    @Column(name = "status", nullable = false)
    private ContractStatus status = ContractStatus.Active;
    
    @ManyToOne
    @JoinColumn(name = "employee_id", insertable = false, updatable = false)
    @JsonIgnore
    private Employee employee;
    
    // Constructors
    public Contract() {}
    
    public Contract(Integer employeeId, ContractType contractType, Integer workHours, 
                   BigDecimal salary, Boolean remoteAvailable, LocalDate startDate) {
        this.employeeId = employeeId;
        this.contractType = contractType;
        this.workHours = workHours;
        this.salary = salary;
        this.remoteAvailable = remoteAvailable;
        this.startDate = startDate;
    }
    
    // Getters and Setters
    public Integer getContractId() { return contractId; }
    public void setContractId(Integer contractId) { this.contractId = contractId; }
    
    public Integer getEmployeeId() { return employeeId; }
    public void setEmployeeId(Integer employeeId) { this.employeeId = employeeId; }
    
    public ContractType getContractType() { return contractType; }
    public void setContractType(ContractType contractType) { this.contractType = contractType; }
    
    public Integer getWorkHours() { return workHours; }
    public void setWorkHours(Integer workHours) { this.workHours = workHours; }
    
    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }
    
    public Boolean getRemoteAvailable() { return remoteAvailable; }
    public void setRemoteAvailable(Boolean remoteAvailable) { this.remoteAvailable = remoteAvailable; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public String getBenefits() { return benefits; }
    public void setBenefits(String benefits) { this.benefits = benefits; }
    
    public ContractStatus getStatus() { return status; }
    public void setStatus(ContractStatus status) { this.status = status; }
    
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
}

