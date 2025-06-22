package com.example.myapp.service;

import com.example.myapp.model.Task;
import com.example.myapp.model.TaskStatus;
import com.example.myapp.model.TaskPriority;
import com.example.myapp.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Transactional(readOnly = true)
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Task> getTaskById(Integer id) {
        return taskRepository.findById(id);
    }
    
    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }
    
    public void deleteTask(Integer id) {
        taskRepository.deleteById(id);
    }
    
    public List<Task> getTasksByProject(Integer projectId) {
        return taskRepository.findByProjectId(projectId);
    }
    
    public List<Task> getTasksByEmployee(Integer employeeId) {
        return taskRepository.findByEmployeeId(employeeId);
    }
    
    public List<Task> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }
    
    public List<Task> getOverdueTasks() {
        return taskRepository.findOverdueTasks(LocalDateTime.now());
    }
    
    public Task completeTask(Integer taskId) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setStatus(TaskStatus.Completed);
            task.setCompletedDate(LocalDateTime.now());
            return taskRepository.save(task);
        }
        return null;
    }
} 