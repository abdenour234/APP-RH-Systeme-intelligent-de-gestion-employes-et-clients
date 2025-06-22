package com.example.myapp.controller;

import com.example.myapp.model.Client;
import com.example.myapp.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientController {
    
    @Autowired
    private ClientService clientService;
    
    @GetMapping
    public List<Client> getAllClients() {
        return clientService.getAllClients();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Integer id) {
        Optional<Client> client = clientService.getClientById(id);
        return client.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return clientService.saveClient(client);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Integer id, @RequestBody Client clientDetails) {
        Optional<Client> clientOpt = clientService.getClientById(id);
        if (clientOpt.isPresent()) {
            Client client = clientOpt.get();
            client.setClientName(clientDetails.getClientName());
            client.setContactPerson(clientDetails.getContactPerson());
            client.setEmail(clientDetails.getEmail());
            client.setPhone(clientDetails.getPhone());
            return ResponseEntity.ok(clientService.saveClient(client));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Integer id) {
        clientService.deleteClient(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/search")
    public List<Client> searchClients(@RequestParam String name) {
        return clientService.searchClientsByName(name);
    }
} 