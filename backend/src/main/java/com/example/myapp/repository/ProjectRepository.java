package com.example.myapp.repository;

import com.example.myapp.model.Project;
import com.example.myapp.model.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    List<Project> findByProjectNameContainingIgnoreCase(String projectName);
    List<Project> findByClientId(Integer clientId);
    List<Project> findByDepartmentId(Integer departmentId);
    List<Project> findByChefId(Integer chefId);
    List<Project> findByStatus(ProjectStatus status);

    @Query("SELECT p FROM Project p WHERE p.startDate BETWEEN ?1 AND ?2")
    List<Project> findByStartDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT p FROM Project p WHERE p.dueAt < ?1 AND p.status != 'Completed'")
    List<Project> findOverdueProjects(LocalDate currentDate);
}
