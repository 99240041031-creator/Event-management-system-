package com.eventmanager.repository;

import com.eventmanager.model.ClubCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClubCertificateRepository extends JpaRepository<ClubCertificate, String> {
    List<ClubCertificate> findByClubId(String clubId);
    List<ClubCertificate> findByRecipientId(String recipientId);
    Optional<ClubCertificate> findByCertificateId(String certificateId);
}
