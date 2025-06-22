package com.example.myapp.service;

import com.example.myapp.model.Contract;
import com.example.myapp.model.ContractStatus;
import com.example.myapp.model.ContractType;
import com.example.myapp.model.Department;
import com.example.myapp.model.Employee;
import com.example.myapp.model.EmployeeStatus;
import com.example.myapp.repository.ContractRepository;
import com.example.myapp.repository.DepartmentRepository;
import com.example.myapp.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EmployeeService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private ContractRepository contractRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
    
    public Optional<Employee> getEmployeeById(Integer id) {
        return employeeRepository.findById(id);
    }
    
    public Employee saveEmployee(Employee employee) {
        // Handle new employee creation (ID should be null for new employees)
        if (employee.getEmployeeId() != null) {
            // This is an update - check if employee exists
            Optional<Employee> existing = employeeRepository.findById(employee.getEmployeeId());
            if (!existing.isPresent()) {
                throw new IllegalArgumentException("Employee with ID " + employee.getEmployeeId() + " does not exist");
            }
        }
        
        // Only validate email uniqueness if email is provided and not empty
        if (employee.getEmail() != null && !employee.getEmail().trim().isEmpty()) {
            Employee existingByEmail = employeeRepository.findByEmail(employee.getEmail());
            if (existingByEmail != null && !existingByEmail.getEmployeeId().equals(employee.getEmployeeId())) {
                throw new IllegalArgumentException("Employee with email " + employee.getEmail() + " already exists");
            }
        }
        
        // Generate a random integer between 1000 and 9999 for new employees
        
        int randomId = (int) (Math.random() * 9000) + 1000;
        employee.setEmployeeId(randomId);
        
        
        try {
            return employeeRepository.save(employee);
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage().contains("duplicate key")) {
                throw new IllegalArgumentException("Employee data conflicts with existing records. Please check employee ID and email uniqueness."+e.getMessage());
            }
            throw e;
        }
    }
    
    public Employee createEmployee(Employee employee) {
        // Ensure this is treated as a new employee
        employee.setEmployeeId(null);
        
        // Set default status if not provided
        if (employee.getStatus() == null) {
            employee.setStatus(EmployeeStatus.Active);
        }
        
        return saveEmployee(employee);
    }
    
    public Employee updateEmployee(Integer id, Employee employeeDetails) {
        Optional<Employee> empOpt = getEmployeeById(id);
        if (empOpt.isPresent()) {
            Employee employee = empOpt.get();
            
            // Update fields
            employee.setFirstName(employeeDetails.getFirstName());
            employee.setLastName(employeeDetails.getLastName());
            
            // Check email uniqueness only if email is being changed
            if (!employee.getEmail().equals(employeeDetails.getEmail())) {
                Employee existingEmployee = employeeRepository.findByEmail(employeeDetails.getEmail());
                if (existingEmployee != null && !existingEmployee.getEmployeeId().equals(id)) {
                    throw new IllegalArgumentException("Email " + employeeDetails.getEmail() + " is already in use");
                }
                employee.setEmail(employeeDetails.getEmail());
            }
            
            employee.setJobTitle(employeeDetails.getJobTitle());
            employee.setDepartmentId(employeeDetails.getDepartmentId());
            employee.setManagerId(employeeDetails.getManagerId());
            employee.setStatus(employeeDetails.getStatus());
            employee.setAge(employeeDetails.getAge());
            employee.setSexe(employeeDetails.getSexe());
            
            return employeeRepository.save(employee);
        }
        throw new IllegalArgumentException("Employee with ID " + id + " not found");
    }
    @Transactional
    public Employee saveEmployeeWithContract(Employee employee, ContractData contractData) {
        logger.info("Starting saveEmployeeWithContract for employee: {}", employee);
        
        // Validate Employee
        logger.debug("Validating employee data");
        if (employee.getFirstName() == null || employee.getFirstName().trim().isEmpty()) {
            logger.error("Validation failed: First name is required");
            throw new IllegalArgumentException("First name is required");
        }
        if (employee.getLastName() == null || employee.getLastName().trim().isEmpty()) {
            logger.error("Validation failed: Last name is required");
            throw new IllegalArgumentException("Last name is required");
        }
        if (employee.getEmail() == null || !employee.getEmail().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            logger.error("Validation failed: Invalid email format: {}", employee.getEmail());
            throw new IllegalArgumentException("Valid email is required");
        }
        if (employee.getHireDate() == null) {
            logger.error("Validation failed: Hire date is required");
            throw new IllegalArgumentException("Hire date is required");
        }
        if (employee.getJobTitle() == null || employee.getJobTitle().trim().isEmpty()) {
            logger.error("Validation failed: Job title is required");
            throw new IllegalArgumentException("Job title is required");
        }
        if (employee.getAge() != null && (employee.getAge() < 18 || employee.getAge() > 70)) {
            logger.error("Validation failed: Invalid age: {}", employee.getAge());
            throw new IllegalArgumentException("Age must be between 18 and 70");
        }
        if (employee.getSexe() == null || employee.getSexe().trim().isEmpty()) {
            logger.error("Validation failed: Gender is required");
            throw new IllegalArgumentException("Gender is required");
        }

        // Validate foreign keys
        logger.debug("Validating foreign keys");
        if (employee.getDepartmentId() != null) {
            logger.debug("Checking department ID: {}", employee.getDepartmentId());
            if (!departmentRepository.existsById(employee.getDepartmentId())) {
                logger.error("Validation failed: Invalid department ID: {}", employee.getDepartmentId());
                throw new IllegalArgumentException("Invalid department ID: " + employee.getDepartmentId());
            }
        }
        if (employee.getManagerId() != null) {
            logger.debug("Checking manager ID: {}", employee.getManagerId());
            if (!employeeRepository.existsById(employee.getManagerId())) {
                logger.error("Validation failed: Invalid manager ID: {}", employee.getManagerId());
                throw new IllegalArgumentException("Invalid manager ID: " + employee.getManagerId());
            }
        }
        
        // Validate managerId matches department's headEmployeeId
        if (employee.getDepartmentId() != null && employee.getManagerId() != null) {
            logger.debug("Validating manager ID matches department head");
            Department department = departmentRepository.findById(employee.getDepartmentId())
                    .orElseThrow(() -> {
                        logger.error("Department not found with ID: {}", employee.getDepartmentId());
                        return new IllegalArgumentException("Department not found");
                    });
            if (department.getHeadEmployeeId() != null && !department.getHeadEmployeeId().equals(employee.getManagerId())) {
                logger.error("Manager ID {} does not match department head {}", employee.getManagerId(), department.getHeadEmployeeId());
                throw new IllegalArgumentException("Manager ID does not match the department's head employee");
            }
        }

        // Validate ContractData
        logger.debug("Validating contract data");
        if (contractData.getContractType() == null) {
            logger.error("Validation failed: Contract type is required");
            throw new IllegalArgumentException("Contract type is required");
        }
        if (contractData.getWorkHours() == null || contractData.getWorkHours() <= 0) {
            logger.error("Validation failed: Invalid work hours: {}", contractData.getWorkHours());
            throw new IllegalArgumentException("Valid work hours are required");
        }
        if (contractData.getSalary() == null || contractData.getSalary().compareTo(BigDecimal.ZERO) <= 0) {
            logger.error("Validation failed: Invalid salary: {}", contractData.getSalary());
            throw new IllegalArgumentException("Valid salary is required");
        }
        if (contractData.getStartDate() == null) {
            logger.error("Validation failed: Contract start date is required");
            throw new IllegalArgumentException("Contract start date is required");
        }

        try {
            logger.info("All validations passed, proceeding with save operation");
            
            // Generate a random integer between 1000 and 9999 for new employees
            int randomId = (int) (Math.random() * 9000) + 1000;
            logger.debug("Generated employee ID: {}", randomId);
            employee.setEmployeeId(randomId);
            
            // Save employee
            logger.debug("Saving employee to database");
            Employee savedEmployee = employeeRepository.save(employee);
            logger.info("Employee saved successfully with ID: {}", savedEmployee.getEmployeeId());

            // Create and save contract
            logger.debug("Creating contract for employee");
            Contract contract = new Contract();
            contract.setContractId(randomId);
            contract.setEmployeeId(savedEmployee.getEmployeeId());
            contract.setContractType(contractData.getContractType());
            contract.setWorkHours(contractData.getWorkHours());
            contract.setSalary(contractData.getSalary());
            contract.setRemoteAvailable(contractData.getRemoteAvailable());
            contract.setStartDate(contractData.getStartDate());
            contract.setEndDate(contractData.getEndDate());
            contract.setBenefits(contractData.getBenefits());
            contract.setStatus(contractData.getStatus() != null ? contractData.getStatus() : ContractStatus.Active);

            logger.debug("Saving contract to database");
            contractRepository.save(contract);
            logger.info("Contract saved successfully with ID: {}", contract.getContractId());

            return savedEmployee;
        } catch (DataIntegrityViolationException e) {
            logger.error("Database constraint violation while saving employee/contract", e);
            throw new IllegalArgumentException("Database constraint violation: " + e.getRootCause().getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error while saving employee with contract", e);
            throw new RuntimeException("Failed to create employee with contract: " + e.getMessage(), e);
        }
    }
    public void deleteEmployee(Integer id) {
        if (!employeeRepository.existsById(id)) {
            throw new IllegalArgumentException("Employee with ID " + id + " not found");
        }
        employeeRepository.deleteById(id);
    }
    
    public List<Employee> searchEmployeesByName(String name) {
        return employeeRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
    }
    
    public List<Employee> getEmployeesByDepartment(Integer departmentId) {
        return employeeRepository.findByDepartmentId(departmentId);
    }
    
    public List<Employee> getEmployeesByManager(Integer managerId) {
        return employeeRepository.findByManagerId(managerId);
    }
    
    public List<Employee> getEmployeesByStatus(EmployeeStatus status) {
        return employeeRepository.findByStatus(status);
    }
    
    public Employee getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }
    
    public boolean existsByEmail(String email) {
        return employeeRepository.findByEmail(email) != null;
    }
    // Helper class to hold contract data
    public static class ContractData {
        private ContractType contractType;
        private Integer workHours;
        private BigDecimal salary;
        private Boolean remoteAvailable;
        private LocalDate startDate;
        private LocalDate endDate;
        private String benefits;
        private ContractStatus status;
        
        // Constructors
        public ContractData() {}
        
        public ContractData(ContractType contractType, Integer workHours, BigDecimal salary, 
                           Boolean remoteAvailable, LocalDate startDate) {
            this.contractType = contractType;
            this.workHours = workHours;
            this.salary = salary;
            this.remoteAvailable = remoteAvailable;
            this.startDate = startDate;
        }
        
        // Getters and Setters
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
    }
}