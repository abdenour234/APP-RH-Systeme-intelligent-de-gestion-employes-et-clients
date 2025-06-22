package com.example.myapp.repository;

import com.example.myapp.model.Contract;
import com.example.myapp.model.ContractStatus;
import com.example.myapp.model.ContractType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer> {
    List<Contract> findByEmployeeId(Integer employeeId);
    List<Contract> findByContractType(ContractType contractType);
    List<Contract> findByStatus(ContractStatus status);
    List<Contract> findByRemoteAvailable(Boolean remoteAvailable);

    Contract findByEmployeeIdAndStatus(Integer employeeId, ContractStatus status);
}
