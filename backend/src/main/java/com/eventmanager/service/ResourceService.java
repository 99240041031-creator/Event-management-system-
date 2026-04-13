package com.eventmanager.service;

import com.eventmanager.model.Resource;
import com.eventmanager.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public Resource save(Resource resource) {
        return resourceRepository.save(resource);
    }
    
    public List<Resource> getAll() {
        return resourceRepository.findAll();
    }

    public void delete(Long id) {
        resourceRepository.deleteById(id);
    }
}
