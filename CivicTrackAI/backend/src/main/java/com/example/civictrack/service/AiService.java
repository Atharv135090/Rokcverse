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

    public AiService() {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);
        this.restTemplate = new RestTemplate(factory);
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
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + apiKey;

            Map<String, Object> requestBody = new HashMap<>();
            
            Map<String, Object> inlineData = new HashMap<>();
            inlineData.put("mimeType", "image/jpeg");
            inlineData.put("data", base64Image);

            Map<String, Object> imagePart = new HashMap<>();
            imagePart.put("inlineData", inlineData);

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", "Analyze this image. If it shows a civic or infrastructure issue (like a pothole, garbage, pipeline break, water leak, broken street light, etc.), describe it accurately. Provide a relevant short category word or phrase (e.g., 'Pipeline', 'Pothole', 'Waste'). If it is NOT a civic issue, set category to 'Other'. Provide the response STRICTLY as a raw JSON object with NO markdown, NO backticks, and NO extra text. Format: {\"title\": \"Short descriptive title\", \"description\": \"Detailed description\", \"priority\": \"HIGH or MEDIUM or LOW\", \"category\": \"Relevant Category\"}");

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
                
                // Clean up markdown aggressively
                String cleanJson = textResponse.replaceAll("(?i)```json", "").replaceAll("```", "").trim();
                if (cleanJson.startsWith("{") && cleanJson.endsWith("}")) {
                    return objectMapper.readValue(cleanJson, AiResult.class);
                } else {
                    int start = cleanJson.indexOf("{");
                    int end = cleanJson.lastIndexOf("}");
                    if (start != -1 && end != -1) {
                        return objectMapper.readValue(cleanJson.substring(start, end + 1), AiResult.class);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error during AI communication: {}", e.getMessage());
        }
        return getFallbackResult();
    }

    private AiResult getFallbackResult() {
        return new AiResult("Civic Issue Detected", "Issue detected from uploaded image", "MEDIUM", "Other");
    }

    public static class AiResult {
        private String title;
        private String description;
        private String priority;
        private String category;

        public AiResult() {}

        public AiResult(String title, String description, String priority, String category) {
            this.title = title;
            this.description = description;
            this.priority = priority;
            this.category = category;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }
}
