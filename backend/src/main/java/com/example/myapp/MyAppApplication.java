package com.example.myapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EntityScan("com.example.myapp.model")
@EnableJpaRepositories("com.example.myapp.repository")
@EnableTransactionManagement
@EnableCaching
public class MyAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyAppApplication.class, args);
    }
} 