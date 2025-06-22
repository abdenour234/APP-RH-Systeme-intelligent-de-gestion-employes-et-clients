package com.example.myapp.repository;

import com.example.myapp.model.EmployeeHistory;
import com.example.myapp.model.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmployeeHistoryRepository extends JpaRepository<EmployeeHistory, Integer> {
    List<EmployeeHistory> findByEmployeeId(Integer employeeId);
    List<EmployeeHistory> findByEventType(EventType eventType);
    List<EmployeeHistory> findByEmployeeIdOrderByEventDateDesc(Integer employeeId);
}
