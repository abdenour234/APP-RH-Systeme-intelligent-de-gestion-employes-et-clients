package com.example.myapp.repository;

import com.example.myapp.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    List<Department> findByDepartmentNameContainingIgnoreCase(String departmentName);
    Department findByDepartmentName(String departmentName);
} 