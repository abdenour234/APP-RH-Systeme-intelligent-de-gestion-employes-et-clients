package com.example.myapp.service;

import com.example.myapp.model.Contract;
import com.example.myapp.model.ContractStatus;
import com.example.myapp.model.ContractType;
import com.example.myapp.repository.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContractService {
    
    @Autowired
    private ContractRepository contractRepository;
    
    @Transactional(readOnly = true)
    public List<Contract> getAllContracts() {
        return contractRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Contract> getContractById(Integer id) {
        return contractRepository.findById(id);
    }
    
    public Contract saveContract(Contract contract) {
        return contractRepository.save(contract);
    }
    
    public void deleteContract(Integer id) {
        contractRepository.deleteById(id);
    }
    
    public List<Contract> getContractsByEmployee(Integer employeeId) {
        return contractRepository.findByEmployeeId(employeeId);
    }
    
    public List<Contract> getContractsByType(ContractType contractType) {
        return contractRepository.findByContractType(contractType);
    }
    
    public Contract getActiveContractByEmployee(Integer employeeId) {
        return contractRepository.findByEmployeeIdAndStatus(employeeId, ContractStatus.Active);
    }
} 