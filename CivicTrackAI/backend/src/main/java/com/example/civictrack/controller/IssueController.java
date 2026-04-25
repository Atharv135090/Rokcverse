package com.example.civictrack.controller;

import com.example.civictrack.model.Issue;
import com.example.civictrack.repository.IssueRepository;
import com.example.civictrack.service.AiService;
import com.example.civictrack.service.ImgBBService;
import com.example.civictrack.repository.UserRepository;
import com.example.civictrack.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "*", maxAge = 3600)
public class IssueController {

    private static final Logger logger = LoggerFactory.getLogger(IssueController.class);

    private final IssueRepository issueRepository;
    private final AiService aiService;
    private final ImgBBService imgBBService;
    private final UserRepository userRepository;

    public IssueController(IssueRepository issueRepository, AiService aiService, ImgBBService imgBBService, UserRepository userRepository) {
        this.issueRepository = issueRepository;
        this.aiService = aiService;
        this.imgBBService = imgBBService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Issue> getIssueById(@PathVariable Long id) {
        return issueRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/report")
    public ResponseEntity<Issue> reportIssue(@RequestParam("image") MultipartFile image,
                                             @RequestParam("latitude") Double latitude,
                                             @RequestParam("longitude") Double longitude,
                                             @RequestParam(value = "userId", required = false) Long userId) {
        logger.info("Received issue report. Size: {}", image.getSize());
        try {
            // 1. Upload logic
            String imageUrl = imgBBService.uploadImage(image);
            if (imageUrl == null) {
                logger.error("Upload failed");
                return ResponseEntity.internalServerError().build();
            }

            // 2. AI processing logic
            AiService.AiResult aiResult = aiService.analyzeImage(imageUrl);

            // 3. Save to DB
            Issue issue = new Issue();
            issue.setImageUrl(imageUrl);
            issue.setTitle(aiResult.getTitle());
            issue.setDescription(aiResult.getDescription());
            issue.setPriority(aiResult.getPriority());
            issue.setLatitude(latitude);
            issue.setLongitude(longitude);
            issue.setStatus("OPEN");
            
            if (userId != null) {
                userRepository.findById(userId).ifPresent(issue::setUser);
            }

            Issue savedIssue = issueRepository.save(issue);
            return ResponseEntity.ok(savedIssue);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<Issue> updateStatus(@PathVariable Long id, @RequestParam("status") String status) {
        return issueRepository.findById(id).map(issue -> {
            issue.setStatus(status);
            return ResponseEntity.ok(issueRepository.save(issue));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id) {
        issueRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
