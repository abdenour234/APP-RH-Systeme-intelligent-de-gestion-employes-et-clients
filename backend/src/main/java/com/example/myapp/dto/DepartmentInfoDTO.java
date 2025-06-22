package com.example.myapp.dto;

public class DepartmentInfoDTO {
    private Integer departmentId;
    private String departmentName;
    private String managerFullName;
    private Integer managerId; // Added to map to headEmployeeId

    public DepartmentInfoDTO(Integer departmentId, String departmentName, String managerFullName, Integer managerId) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.managerFullName = managerFullName;
        this.managerId = managerId;
    }

    public Integer getDepartmentId() { return departmentId; }
    public String getDepartmentName() { return departmentName; }
    public String getManagerFullName() { return managerFullName; }
    public Integer getManagerId() { return managerId; }
}