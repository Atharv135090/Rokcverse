package com.example.civictrack.controller;

import com.example.civictrack.model.User;
import com.example.civictrack.model.LoginActivity;
import com.example.civictrack.repository.UserRepository;
import com.example.civictrack.repository.LoginActivityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final LoginActivityRepository loginActivityRepository;

    public AdminController(UserRepository userRepository, LoginActivityRepository loginActivityRepository) {
        this.userRepository = userRepository;
        this.loginActivityRepository = loginActivityRepository;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/users/{id}/block")
    public ResponseEntity<?> blockUser(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            boolean blockStatus = payload.getOrDefault("isBlocked", true);
            user.setBlocked(blockStatus);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", blockStatus ? "User blocked" : "User unblocked"));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/activities")
    public List<LoginActivity> getLoginActivities() {
        return loginActivityRepository.findAllByOrderByTimestampDesc();
    }
}
