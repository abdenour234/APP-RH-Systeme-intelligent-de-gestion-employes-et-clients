package com.example.myapp.controller;

import com.example.myapp.model.Ticket;
import com.example.myapp.model.TicketStatus;
import com.example.myapp.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {
    
    @Autowired
    private TicketService ticketService;
    
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Integer id) {
        Optional<Ticket> ticket = ticketService.getTicketById(id);
        return ticket.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.saveTicket(ticket);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Integer id, @RequestBody Ticket ticketDetails) {
        Optional<Ticket> ticketOpt = ticketService.getTicketById(id);
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            ticket.setTitle(ticketDetails.getTitle());
            ticket.setDescription(ticketDetails.getDescription());
            ticket.setPriority(ticketDetails.getPriority());
            ticket.setStatus(ticketDetails.getStatus());
            return ResponseEntity.ok(ticketService.saveTicket(ticket));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable Integer id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/client/{clientId}")
    public List<Ticket> getTicketsByClient(@PathVariable Integer clientId) {
        return ticketService.getTicketsByClient(clientId);
    }
    
    @GetMapping("/employee/{employeeId}")
    public List<Ticket> getTicketsByEmployee(@PathVariable Integer employeeId) {
        return ticketService.getTicketsByEmployee(employeeId);
    }
    
    @PostMapping("/{id}/resolve")
    public ResponseEntity<Ticket> resolveTicket(@PathVariable Integer id) {
        Ticket ticket = ticketService.resolveTicket(id);
        return ticket != null ? ResponseEntity.ok(ticket) : ResponseEntity.notFound().build();
    }
} 