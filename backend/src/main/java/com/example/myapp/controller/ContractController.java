package com.example.myapp.controller;

import com.example.myapp.controller.EmployeeController.ErrorResponse;
import com.example.myapp.model.Contract;
import com.example.myapp.model.ContractStatus;
import com.example.myapp.model.ContractType;
import com.example.myapp.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contracts")
@CrossOrigin(origins = "*")
public class ContractController {
   
    @Autowired
    private ContractService contractService;
   
    @GetMapping
    public List<Contract> getAllContracts() {
        return contractService.getAllContracts();
    }
   
    @GetMapping("/{id}")
    public ResponseEntity<Contract> getContractById(@PathVariable Integer id) {
        Optional<Contract> contract = contractService.getContractById(id);
        return contract.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
   
    @PostMapping
    public ResponseEntity<?> createContract(@RequestBody Contract contract) {
        try {
            // Validate required fields
            if (contract.getEmployeeId() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Validation Error", "Employee ID is required"));
            }
            if (contract.getContractType() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Validation Error", "Contract type is required"));
            }
            if (contract.getWorkHours() == null || contract.getWorkHours() <= 0) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Validation Error", "Valid work hours are required"));
            }
            if (contract.getSalary() == null || contract.getSalary().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Validation Error", "Valid salary is required"));
            }
            if (contract.getStartDate() == null) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Validation Error", "Start date is required"));
            }

            // Set default status if not provided
            if (contract.getStatus() == null) {
                contract.setStatus(ContractStatus.Active);
            }

            Contract savedContract = contractService.saveContract(contract);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedContract);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Invalid input", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Server error", e.getMessage()));
        }
    }
   
    @PutMapping("/{id}")
    public ResponseEntity<Contract> updateContract(@PathVariable Integer id, @RequestBody Contract contractDetails) {
        Optional<Contract> contractOpt = contractService.getContractById(id);
        if (contractOpt.isPresent()) {
            Contract contract = contractOpt.get();
            
            // Update fields
            contract.setContractType(contractDetails.getContractType());
            contract.setWorkHours(contractDetails.getWorkHours());
            contract.setSalary(contractDetails.getSalary());
            contract.setRemoteAvailable(contractDetails.getRemoteAvailable());
            contract.setStartDate(contractDetails.getStartDate());
            contract.setEndDate(contractDetails.getEndDate());
            contract.setBenefits(contractDetails.getBenefits());
            contract.setStatus(contractDetails.getStatus());
            
            return ResponseEntity.ok(contractService.saveContract(contract));
        }
        return ResponseEntity.notFound().build();
    }
   
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContract(@PathVariable Integer id) {
        Optional<Contract> contract = contractService.getContractById(id);
        if (contract.isPresent()) {
            contractService.deleteContract(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
   
    @GetMapping("/employee/{employeeId}")
    public List<Contract> getContractsByEmployee(@PathVariable Integer employeeId) {
        return contractService.getContractsByEmployee(employeeId);
    }
   
    @GetMapping("/type/{contractType}")
    public List<Contract> getContractsByType(@PathVariable ContractType contractType) {
        return contractService.getContractsByType(contractType);
    }
   
    @GetMapping("/employee/{employeeId}/active")
    public ResponseEntity<Contract> getActiveContractByEmployee(@PathVariable Integer employeeId) {
        Contract contract = contractService.getActiveContractByEmployee(employeeId);
        return contract != null ? ResponseEntity.ok(contract) : ResponseEntity.notFound().build();
    }
} 