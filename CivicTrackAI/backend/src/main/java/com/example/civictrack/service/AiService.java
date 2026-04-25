package com.example.civictrack.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    private static final Logger logger = LoggerFactory.getLogger(AiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }

    public AiResult analyzeImage(String imageUrl) {
        logger.info("Starting AI analysis for image: {}", imageUrl);
        if (apiKey == null || apiKey.isEmpty()) {
            logger.warn("Gemini API key is missing. Using fallback defaults.");
            return getFallbackResult();
        }
        try {
            byte[] imageBytes = restTemplate.getForObject(imageUrl, byte[].class);
            if (imageBytes == null) throw new RuntimeException("Failed to download image from URL");
            
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

            Map<String, Object> requestBody = new HashMap<>();
            
            Map<String, Object> inlineData = new HashMap<>();
            inlineData.put("mimeType", "image/jpeg");
            inlineData.put("data", base64Image);

            Map<String, Object> imagePart = new HashMap<>();
            imagePart.put("inlineData", inlineData);

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", "Analyze this image accurately. If it is a civic issue (like a pothole, garbage, or broken infrastructure), identify it specifically. If it is NOT a civic issue, describe exactly what it is (e.g., 'Pet animal', 'Beautiful landscape', 'Person'). Provide a JSON response EXACTLY in this format, with no markdown formatting or backticks: {\"title\": \"Short descriptive title\", \"description\": \"Detailed description of the content\", \"priority\": \"HIGH or MEDIUM or LOW (use LOW for non-issues)\"}");

            Map<String, Object> part1 = new HashMap<>();
            part1.put("parts", List.of(textPart, imagePart));

            requestBody.put("contents", List.of(part1));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                String textResponse = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
                
                // Clean up possible markdown from AI
                String cleanJson = textResponse.replaceAll("```json", "").replaceAll("```", "").trim();
                
                return objectMapper.readValue(cleanJson, AiResult.class);
            }
        } catch (Exception e) {
            logger.error("Error during AI communication: {}", e.getMessage());
        }
        return getFallbackResult();
    }

    private AiResult getFallbackResult() {
        return new AiResult("Civic Issue Detected", "Issue detected from uploaded image", "Medium");
    }

    public static class AiResult {
        private String title;
        private String description;
        private String priority;

        public AiResult() {}

        public AiResult(String title, String description, String priority) {
            this.title = title;
            this.description = description;
            this.priority = priority;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
    }
}
