package com.eventmanager.repository;

import com.eventmanager.model.ClubAmbassador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClubAmbassadorRepository extends JpaRepository<ClubAmbassador, String> {
    List<ClubAmbassador> findByClubId(String clubId);
    List<ClubAmbassador> findByStudentId(String studentId);
}
