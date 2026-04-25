package com.example.civictrack.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;
import java.util.Map;

@Service
public class ImgBBService {

    @Value("${imgbb.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public ImgBBService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String uploadImage(MultipartFile file) {
        if (apiKey == null || apiKey.isEmpty()) {
            return "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80"; // Fallback civic issue image
        }
        try {
            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
            String url = "https://api.imgbb.com/1/upload?key=" + apiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("image", base64Image);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
                return (String) data.get("url");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80"; // Fallback civic issue image
    }
}
