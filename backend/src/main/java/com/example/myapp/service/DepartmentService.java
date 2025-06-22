package com.example.myapp.service;

import com.example.myapp.dto.DepartmentInfoDTO;
import com.example.myapp.model.Department;
import com.example.myapp.model.Employee;
import com.example.myapp.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DepartmentService {
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    @Transactional(readOnly = true)
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
    
    @Cacheable("departmentsWithManagers")
    @Transactional(readOnly = true)
    public List<DepartmentInfoDTO> getDepartmentsWithManagerNames() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream().map(dept -> {
            Employee manager = dept.getHeadEmployee();
            String managerName = (manager != null) ? manager.getFirstName() + " " + manager.getLastName() : "N/A";
            Integer managerId = (manager != null) ? manager.getEmployeeId() : null;
            return new DepartmentInfoDTO(dept.getDepartmentId(), dept.getDepartmentName(), managerName, managerId);
        }).toList();
    }

    @Transactional(readOnly = true)
    public Optional<Department> getDepartmentById(Integer id) {
        return departmentRepository.findById(id);
    }
    
    public Department saveDepartment(Department department) {
        return departmentRepository.save(department);
    }
    
    public void deleteDepartment(Integer id) {
        departmentRepository.deleteById(id);
    }
    
    public List<Department> searchDepartmentsByName(String name) {
        return departmentRepository.findByDepartmentNameContainingIgnoreCase(name);
    }
    
    public Department getDepartmentByName(String name) {
        return departmentRepository.findByDepartmentName(name);
    }
} 