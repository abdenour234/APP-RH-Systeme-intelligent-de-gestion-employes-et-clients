package com.example.myapp.controller;

import com.example.myapp.model.Employee;
import com.example.myapp.model.EmployeeStatus;
import com.example.myapp.model.ContractType;
import com.example.myapp.model.ContractStatus;
import com.example.myapp.service.EmployeeService;
import com.example.myapp.service.EmployeeService.ContractData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {
    
    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);
    
    @Autowired
    private EmployeeService employeeService;
    
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Integer id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        return employee.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody EmployeeWithContractRequest request) {
        logger.info("Received request to create new employee with data: {}", request);
        try {
            // Create Employee object
            logger.debug("Creating Employee object from request data");
            Employee employee = new Employee();
            employee.setFirstName(request.getFirstName());
            employee.setLastName(request.getLastName());
            employee.setEmail(request.getEmail());
            employee.setHireDate(request.getHireDate());
            employee.setJobTitle(request.getJobTitle());
            employee.setManagerId(request.getManagerId());
            employee.setStatus(request.getStatus());
            employee.setAge(request.getAge());
            employee.setSexe(request.getSexe());
            employee.setDepartmentId(request.getDepartmentId());
            
            logger.debug("Created Employee object: {}", employee);
            
            // Create Contract data
            logger.debug("Creating Contract data from request");
            ContractData contractData = new ContractData();
            contractData.setContractType(ContractType.valueOf(request.getContractType()));
            contractData.setWorkHours(request.getWorkHours());
            contractData.setSalary(request.getSalary());
            contractData.setRemoteAvailable(request.getRemoteAvailable());
            contractData.setStartDate(request.getContractStartDate());
            contractData.setEndDate(request.getContractEndDate());
            contractData.setBenefits(request.getBenefits());
            contractData.setStatus(ContractStatus.valueOf(request.getContractStatus()));
            
            logger.debug("Created Contract data: {}", contractData);
            
            // Save employee with contract in a transaction
            logger.info("Attempting to save employee with contract");
            Employee savedEmployee = employeeService.saveEmployeeWithContract(employee, contractData);
            logger.info("Successfully saved employee with ID: {}", savedEmployee.getEmployeeId());
            
            return ResponseEntity.ok(savedEmployee);
            
        } catch (IllegalArgumentException e) {
            logger.error("Validation error while creating employee: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Validation error: ", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error while creating employee", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Failed to create employee: ", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Integer id, @RequestBody Employee employeeDetails) {
        Optional<Employee> employeeOpt = employeeService.getEmployeeById(id);
        if (employeeOpt.isPresent()) {
            Employee employee = employeeOpt.get();
            
            // Update fields
            employee.setFirstName(employeeDetails.getFirstName());
            employee.setLastName(employeeDetails.getLastName());
            employee.setEmail(employeeDetails.getEmail());
            employee.setHireDate(employeeDetails.getHireDate());
            employee.setJobTitle(employeeDetails.getJobTitle());
            employee.setManagerId(employeeDetails.getManagerId());
            employee.setStatus(employeeDetails.getStatus());
            employee.setAge(employeeDetails.getAge());
            employee.setSexe(employeeDetails.getSexe());
            employee.setDepartmentId(employeeDetails.getDepartmentId());
            
            return ResponseEntity.ok(employeeService.saveEmployee(employee));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Integer id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        if (employee.isPresent()) {
            employeeService.deleteEmployee(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // DTO for request body that includes both employee and contract data
    public static class EmployeeWithContractRequest {
        // Employee fields
        private String firstName;
        private String lastName;
        private String email;
        private LocalDate hireDate;
        private String jobTitle;
        private Integer managerId;
        private EmployeeStatus status;
        private Integer age;
        private String sexe;
        private Integer departmentId;
        
        // Contract fields
        private String contractType;
        private Integer workHours;
        private BigDecimal salary;
        private Boolean remoteAvailable;
        private LocalDate contractStartDate;
        private LocalDate contractEndDate;
        private String benefits;
        private String contractStatus;
        
        // Getters and Setters
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public LocalDate getHireDate() { return hireDate; }
        public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }
        
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
        
        public Integer getDepartmentId() { return departmentId; }
        public void setDepartmentId(Integer departmentId) { this.departmentId = departmentId; }
        
        public String getContractType() { return contractType; }
        public void setContractType(String contractType) { this.contractType = contractType; }
        
        public Integer getWorkHours() { return workHours; }
        public void setWorkHours(Integer workHours) { this.workHours = workHours; }
        
        public BigDecimal getSalary() { return salary; }
        public void setSalary(BigDecimal salary) { this.salary = salary; }
        
        public Boolean getRemoteAvailable() { return remoteAvailable; }
        public void setRemoteAvailable(Boolean remoteAvailable) { this.remoteAvailable = remoteAvailable; }
        
        public LocalDate getContractStartDate() { return contractStartDate; }
        public void setContractStartDate(LocalDate contractStartDate) { this.contractStartDate = contractStartDate; }
        
        public LocalDate getContractEndDate() { return contractEndDate; }
        public void setContractEndDate(LocalDate contractEndDate) { this.contractEndDate = contractEndDate; }
        
        public String getBenefits() { return benefits; }
        public void setBenefits(String benefits) { this.benefits = benefits; }
        
        public String getContractStatus() { return contractStatus; }
        public void setContractStatus(String contractStatus) { this.contractStatus = contractStatus; }
    }
    
    // Error response class
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message, String errorDetails) {
            this.message = message + errorDetails;
        }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}