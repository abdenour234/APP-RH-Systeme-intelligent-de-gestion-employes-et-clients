package com.example.myapp.config;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class SupabaseDataSourceConfig {
    
    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:postgresql://13.39.246.141:6543/postgres?ssl=true&sslmode=require&prepareThreshold=0&preparedStatementCacheQueries=0");
        config.setUsername("postgres.gcftmbhqlkqcamiwjoky");
        config.setPassword("Oujda@oujda");
        config.setMaximumPoolSize(3); // Even smaller for Supabase
        config.setConnectionTimeout(30000);
        config.addDataSourceProperty("cachePrepStmts", "false");
        config.addDataSourceProperty("useServerPrepStmts", "false");
        return new HikariDataSource(config);
    }
}