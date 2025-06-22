package com.example.myapp.service;

import com.example.myapp.model.Ticket;
import com.example.myapp.model.TicketStatus;
import com.example.myapp.model.TicketPriority;
import com.example.myapp.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TicketService {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Transactional(readOnly = true)
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAllWithRelations();
    }
    
    @Transactional(readOnly = true)
    public Optional<Ticket> getTicketById(Integer id) {
        return ticketRepository.findById(id);
    }
    
    public Ticket saveTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }
    
    public void deleteTicket(Integer id) {
        ticketRepository.deleteById(id);
    }
    
    public List<Ticket> getTicketsByClient(Integer clientId) {
        return ticketRepository.findByClientId(clientId);
    }
    
    public List<Ticket> getTicketsByEmployee(Integer employeeId) {
        return ticketRepository.findByEmployeeId(employeeId);
    }
    
    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }
    
    public Ticket resolveTicket(Integer ticketId) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            ticket.setStatus(TicketStatus.Resolved);
            ticket.setResolvedAt(LocalDateTime.now());
            return ticketRepository.save(ticket);
        }
        return null;
    }
} 