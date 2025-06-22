package com.example.myapp.controller;

import com.example.myapp.dto.DepartmentInfoDTO;
import com.example.myapp.model.Department;
import com.example.myapp.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {
    
    @Autowired
    private DepartmentService departmentService;
    
    @GetMapping
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Integer id) {
        Optional<Department> department = departmentService.getDepartmentById(id);
        return department.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Department createDepartment(@RequestBody Department department) {
        return departmentService.saveDepartment(department);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable Integer id, @RequestBody Department departmentDetails) {
        Optional<Department> deptOpt = departmentService.getDepartmentById(id);
        if (deptOpt.isPresent()) {
            Department department = deptOpt.get();
            department.setDepartmentName(departmentDetails.getDepartmentName());
            department.setDescription(departmentDetails.getDescription());
            department.setHeadEmployeeId(departmentDetails.getHeadEmployeeId());
            return ResponseEntity.ok(departmentService.saveDepartment(department));
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/with-managers")
    public List<DepartmentInfoDTO> getDepartmentsWithManagers() {
        return departmentService.getDepartmentsWithManagerNames();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Integer id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok().build();
    }
} 