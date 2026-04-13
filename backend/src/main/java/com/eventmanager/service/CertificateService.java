package com.eventmanager.service;

import com.eventmanager.dto.CertificateDto;
import java.util.List;
import java.util.Optional;

public interface CertificateService {
    CertificateDto generateCertificate(String userId, String eventId, String category, String role);

    CertificateDto generateHackathonCertificate(String userId, String hackathonId, String category, String role);

    byte[] downloadCertificatePdf(String certificateId, String userId);

    Optional<CertificateDto> verifyCertificate(String certificateId, String ipAddress);

    List<CertificateDto> getUserCertificates(String userId);

    CertificateDto getCertificateById(String id, String userId);

    void seedCertificateData(String userId);

    void seedAllCertificates();
}
