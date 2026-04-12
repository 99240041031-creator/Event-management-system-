package com.eventmanager.repository;

import com.eventmanager.model.ExternalCampus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExternalCampusRepository extends JpaRepository<ExternalCampus, String> {
}
