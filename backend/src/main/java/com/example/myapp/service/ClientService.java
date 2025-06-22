package com.example.myapp.service;

import com.example.myapp.model.Client;
import com.example.myapp.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClientService {
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Transactional(readOnly = true)
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Client> getClientById(Integer id) {
        return clientRepository.findById(id);
    }
    
    public Client saveClient(Client client) {
        return clientRepository.save(client);
    }
    
    public void deleteClient(Integer id) {
        clientRepository.deleteById(id);
    }
    
    public List<Client> searchClientsByName(String name) {
        return clientRepository.findByClientNameContainingIgnoreCase(name);
    }
    
    public List<Client> searchClientsByContact(String contact) {
        return clientRepository.findByContactPersonContainingIgnoreCase(contact);
    }
    
    public Client getClientByEmail(String email) {
        return clientRepository.findByEmail(email);
    }
} 