package com.example.myapp.repository;

import com.example.myapp.model.Ticket;
import com.example.myapp.model.TicketStatus;
import com.example.myapp.model.TicketPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.employee LEFT JOIN FETCH t.client")
    List<Ticket> findAllWithRelations();
    
    List<Ticket> findByClientId(Integer clientId);
    List<Ticket> findByEmployeeId(Integer employeeId);
    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findByPriority(TicketPriority priority);
    List<Ticket> findByTitleContainingIgnoreCase(String title);

    List<Ticket> findByClientIdAndStatus(Integer clientId, TicketStatus status);
}
