package com.example.myapp.repository;

import com.example.myapp.model.Task;
import com.example.myapp.model.TaskStatus;
import com.example.myapp.model.TaskPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByProjectId(Integer projectId);
    List<Task> findByEmployeeId(Integer employeeId);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByPriority(TaskPriority priority);
    List<Task> findByTitleContainingIgnoreCase(String title);

    @Query("SELECT t FROM Task t WHERE t.employeeId = ?1 AND t.status = ?2")
    List<Task> findByEmployeeIdAndStatus(Integer employeeId, TaskStatus status);

    @Query("SELECT t FROM Task t WHERE t.dueDate < ?1 AND t.status != 'Completed'")
    List<Task> findOverdueTasks(LocalDateTime currentDate);
}
