package com.example.civictrack.config;

import com.example.civictrack.model.User;
import com.example.civictrack.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("projectedit@gov.in").isEmpty()) {
            User admin = new User();
            admin.setName("atharv");
            admin.setEmail("projectedit@gov.in");
            // The frontend uses btoa() for passwords, which is Base64 encoding.
            // So we store the Base64 representation of "atharv@123" to seamlessly work with standard auth.
            admin.setPassword(Base64.getEncoder().encodeToString("atharv@123".getBytes()));
            admin.setRole("ADMIN");
            
            // For backwards compatibility mapping if username is ever needed 
            admin.setUsername("projectedit@gov.in"); 

            userRepository.save(admin);
            System.out.println("✅ Default Admin Account Created: projectedit@gov.in");
        }
    }
}
