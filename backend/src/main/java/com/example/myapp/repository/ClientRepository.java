package com.example.myapp.repository;

import com.example.myapp.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {
    List<Client> findByClientNameContainingIgnoreCase(String clientName);
    List<Client> findByContactPersonContainingIgnoreCase(String contactPerson);
    Client findByEmail(String email);
} 