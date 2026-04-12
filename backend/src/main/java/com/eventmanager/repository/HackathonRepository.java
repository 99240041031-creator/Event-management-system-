package com.eventmanager.repository;

import com.eventmanager.model.Hackathon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface HackathonRepository extends JpaRepository<Hackathon, String>, JpaSpecificationExecutor<Hackathon> {
    List<Hackathon> findByOrganizer_Id(String organizerId);
    Page<Hackathon> findByOrganizer_Id(String organizerId, Pageable pageable);
    long countByOrganizer_Id(String organizerId);

    List<Hackathon> findByDepartment_Id(String departmentId);
    long countByDepartment_IdAndStatus(String departmentId, String status);
}
