package com.example.myapp.repository;

import com.example.myapp.model.Employee;
import com.example.myapp.model.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    List<Employee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    List<Employee> findByDepartmentId(Integer departmentId);
    List<Employee> findByManagerId(Integer managerId);
    List<Employee> findByStatus(EmployeeStatus status);
    Employee findByEmail(String email);
    List<Employee> findByJobTitleContainingIgnoreCase(String jobTitle);
    
    @Query("SELECT e FROM Employee e WHERE e.departmentId = ?1 AND e.status = ?2")
    List<Employee> findByDepartmentIdAndStatus(Integer departmentId, EmployeeStatus status);
} 