package com.example.myapp.controller;

import com.example.myapp.model.Task;
import com.example.myapp.model.TaskStatus;
import com.example.myapp.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Integer id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.saveTask(task);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Integer id, @RequestBody Task taskDetails) {
        Optional<Task> taskOpt = taskService.getTaskById(id);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setPriority(taskDetails.getPriority());
            task.setStatus(taskDetails.getStatus());
            task.setDueDate(taskDetails.getDueDate());
            return ResponseEntity.ok(taskService.saveTask(task));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Integer id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable Integer projectId) {
        return taskService.getTasksByProject(projectId);
    }
    
    @GetMapping("/employee/{employeeId}")
    public List<Task> getTasksByEmployee(@PathVariable Integer employeeId) {
        return taskService.getTasksByEmployee(employeeId);
    }
    
    @PostMapping("/{id}/complete")
    public ResponseEntity<Task> completeTask(@PathVariable Integer id) {
        Task task = taskService.completeTask(id);
        return task != null ? ResponseEntity.ok(task) : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/overdue")
    public List<Task> getOverdueTasks() {
        return taskService.getOverdueTasks();
    }
} 