package com.example.civictrack.controller;

import com.example.civictrack.model.User;
import com.example.civictrack.repository.UserRepository;
import com.example.civictrack.repository.LoginActivityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final UserRepository userRepository;
    private final LoginActivityRepository loginActivityRepository;

    public AuthController(UserRepository userRepository, LoginActivityRepository loginActivityRepository) {
        this.userRepository = userRepository;
        this.loginActivityRepository = loginActivityRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        logger.info("Received registration request for email: {}", payload.get("email"));
        
        String name = payload.get("name");
        String email = payload.get("email");
        String password = payload.get("password");

        if (name == null || name.trim().isEmpty() || 
            email == null || email.trim().isEmpty() || 
            password == null || password.trim().isEmpty()) {
            logger.warn("Registration failed: Missing required fields");
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
        }

        // Basic email validation
        if (!email.contains("@") || !email.contains(".")) {
            logger.warn("Registration failed: Invalid email format: {}", email);
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email format"));
        }

        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            if ("projectedit@gov.in".equalsIgnoreCase(email)) {
                logger.info("Admin account already exists. Updating credentials for: {}", email);
                User admin = existingUser.get();
                admin.setName(name);
                admin.setPassword(password);
                admin.setRole("ADMIN");
                userRepository.save(admin);
                return ResponseEntity.ok(admin);
            }
            logger.warn("Registration failed: Email already registered: {}", email);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email already registered"));
        }

        try {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(password); 
            
            // ADMIN logic
            if ("projectedit@gov.in".equalsIgnoreCase(email)) {
                user.setRole("ADMIN");
            } else {
                user.setRole("USER");
            }
            
            user.setUsername(email); 

            User savedUser = userRepository.save(user);
            logger.info("User registered successfully: {}", email);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            logger.error("Error during registration for {}: {}", email, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred during registration: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        logger.info("Received login request for email: {}", email);

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            if (user.isBlocked()) {
                logger.warn("Login failed: User is blocked: {}", email);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Your account has been blocked. Contact administrator."));
            }
            
            if (user.getPassword().equals(password)) {
                logger.info("Login successful for user: {}", email);
                
                // Track login activity
                try {
                    loginActivityRepository.save(new com.example.civictrack.model.LoginActivity(email, java.time.LocalDateTime.now()));
                } catch (Exception e) {
                    logger.error("Failed to log login activity: {}", e.getMessage());
                }
                
                return ResponseEntity.ok(user);
            } else {
                logger.warn("Login failed: Incorrect password for user: {}", email);
            }
        } else {
            logger.warn("Login failed: User not found: {}", email);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody Map<String, String> payload) {
        String idStr = payload.get("id");
        String name = payload.get("name");

        logger.info("Received profile update request for user ID: {}", idStr);

        if (idStr == null || name == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
        }
        
        try {
            Long userId = Long.parseLong(idStr);
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setName(name);
                User updatedUser = userRepository.save(user);
                logger.info("User profile updated successfully for ID: {}", userId);
                return ResponseEntity.ok(updatedUser);
            } else {
                logger.warn("Update failed: User not found with ID: {}", userId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
            }
        } catch (NumberFormatException e) {
            logger.warn("Update failed: Invalid user ID format: {}", idStr);
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid user ID format"));
        } catch (Exception e) {
            logger.error("Error during profile update: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An error occurred: " + e.getMessage()));
        }
    }
}
