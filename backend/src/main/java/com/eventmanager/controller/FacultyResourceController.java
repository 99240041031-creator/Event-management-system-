package com.eventmanager.controller;

import com.eventmanager.model.Resource;
import com.eventmanager.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class FacultyResourceController {

    @Autowired
    private ResourceService resourceService;

    @PostMapping
    public ResponseEntity<?> createResource(@RequestBody Resource resource) {
        try {
            System.out.println("URL RECEIVED: " + resource.getUrl());
            if (resource.getUrl() == null || resource.getUrl().isEmpty()) {
                return ResponseEntity.badRequest().body("URL is required");
            }
            Resource saved = resourceService.save(resource);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getResources() {
        return ResponseEntity.ok(resourceService.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResource(@PathVariable Long id) {
        try {
            resourceService.delete(id);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
