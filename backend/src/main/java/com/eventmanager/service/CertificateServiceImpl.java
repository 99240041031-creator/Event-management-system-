package com.eventmanager.service;

import com.eventmanager.dto.CertificateDto;
import com.eventmanager.model.*;
import com.eventmanager.repository.*;
import com.eventmanager.util.QRCodeGenerator;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CertificateServiceImpl implements CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HackathonRepository hackathonRepository;

    @Autowired
    private VerificationLogRepository verificationLogRepository;

    @Override
    public CertificateDto generateCertificate(String userId, String eventId, String category, String role) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));

        Certificate certificate = new Certificate();
        certificate.setUser(user);
        certificate.setEvent(event);
        certificate.setTitle(event.getTitle());
        certificate.setCategory(category);
        
        String fullName = (user.getFirstName() != null ? user.getFirstName() : "") + " " + 
                         (user.getLastName() != null ? user.getLastName() : "");
        if (fullName.trim().isEmpty()) fullName = user.getName();
        certificate.setStudentName(fullName != null ? fullName : "Student");
        
        certificate.setRole(role);
        certificate.setIssuedAt(LocalDateTime.now());
        certificate.setCertificateId("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        certificate.setStatus(Certificate.CertificateStatus.VERIFIED);

        try {
            String verificationUrl = "http://localhost:5173/verify/" + certificate.getCertificateId();
            certificate.setQrCodeUrl(QRCodeGenerator.generateQRCodeImage(verificationUrl, 200, 200));
        } catch (Exception e) {
            certificate.setQrCodeUrl("");
        }

        return convertToDto(certificateRepository.save(certificate));
    }

    @Override
    public CertificateDto generateHackathonCertificate(String userId, String hackathonId, String category, String role) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new RuntimeException("Hackathon not found"));

        Certificate certificate = new Certificate();
        certificate.setUser(user);
        certificate.setHackathon(hackathon);
        certificate.setTitle(hackathon.getTitle());
        certificate.setCategory(category);
        
        String fullName = (user.getFirstName() != null ? user.getFirstName() : "") + " " + 
                         (user.getLastName() != null ? user.getLastName() : "");
        if (fullName.trim().isEmpty()) fullName = user.getName();
        certificate.setStudentName(fullName != null ? fullName : "Student");
        
        certificate.setRole(role);
        certificate.setIssuedAt(LocalDateTime.now());
        certificate.setCertificateId("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        certificate.setStatus(Certificate.CertificateStatus.VERIFIED);

        try {
            String verificationUrl = "http://localhost:5173/verify/" + certificate.getCertificateId();
            certificate.setQrCodeUrl(QRCodeGenerator.generateQRCodeImage(verificationUrl, 200, 200));
        } catch (Exception e) {
            certificate.setQrCodeUrl("");
        }

        return convertToDto(certificateRepository.save(certificate));
    }

    @Override
    public byte[] downloadCertificatePdf(String certificateId, String userId) {
        Certificate cert = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        if (!cert.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to certificate");
        }

        return generatePdf(cert);
    }

    @Override
    public Optional<CertificateDto> verifyCertificate(String certificateId, String ipAddress) {
        Optional<Certificate> certOpt = certificateRepository.findByCertificateId(certificateId);
        
        if (certOpt.isPresent()) {
            VerificationLog log = new VerificationLog();
            log.setCertificateId(certificateId);
            log.setIpAddress(ipAddress);
            log.setVerifiedAt(LocalDateTime.now());
            verificationLogRepository.save(log);
            return Optional.of(convertToDto(certOpt.get()));
        }
        
        return Optional.empty();
    }

    @Override
    public List<CertificateDto> getUserCertificates(String userId) {
        return certificateRepository.findByUserId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CertificateDto getCertificateById(String id, String userId) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
        
        if (!cert.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to certificate");
        }
        
        return convertToDto(cert);
    }

    private CertificateDto convertToDto(Certificate cert) {
        CertificateDto dto = new CertificateDto();
        dto.setId(cert.getId());
        dto.setCertificateId(cert.getCertificateId());
        dto.setStudentId(cert.getUser().getId());
        dto.setStudentName(cert.getStudentName());
        
        if (cert.getEvent() != null) {
            dto.setEventId(cert.getEvent().getId());
            dto.setEventTitle(cert.getEvent().getTitle());
        } else if (cert.getHackathon() != null) {
            dto.setEventId(cert.getHackathon().getId());
            dto.setEventTitle(cert.getHackathon().getTitle());
        }
        
        dto.setCategory(cert.getCategory());
        dto.setRole(cert.getRole());
        dto.setIssuedAt(cert.getIssuedAt());
        dto.setStatus(cert.getStatus().name());
        dto.setQrCodeUrl(cert.getQrCodeUrl());
        dto.setPdfUrl(cert.getPdfUrl());
        return dto;
    }

    private byte[] generatePdf(Certificate cert) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 36, Color.DARK_GRAY);
            Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 48, new Color(41, 128, 185));
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 18, Color.GRAY);
            Font certIdFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.LIGHT_GRAY);

            document.add(new Paragraph("\n"));
            
            Paragraph title = new Paragraph("CERTIFICATE OF COMPLETION", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph("\n\n"));

            Paragraph presentedTo = new Paragraph("This certificate is proudly presented to", subTitleFont);
            presentedTo.setAlignment(Element.ALIGN_CENTER);
            document.add(presentedTo);

            document.add(new Paragraph("\n"));

            Paragraph studentName = new Paragraph(cert.getStudentName(), nameFont);
            studentName.setAlignment(Element.ALIGN_CENTER);
            document.add(studentName);

            document.add(new Paragraph("\n"));

            Paragraph context = new Paragraph("for successfully completing the " + cert.getCategory() + "\n" + cert.getTitle(), subTitleFont);
            context.setAlignment(Element.ALIGN_CENTER);
            document.add(context);

            document.add(new Paragraph("\n\n"));

            if (cert.getQrCodeUrl() != null && !cert.getQrCodeUrl().isEmpty()) {
                String base64Data = cert.getQrCodeUrl().split(",")[1];
                byte[] qrBytes = java.util.Base64.getDecoder().decode(base64Data);
                Image qrImage = Image.getInstance(qrBytes);
                qrImage.scaleToFit(100, 100);
                qrImage.setAlignment(Element.ALIGN_CENTER);
                document.add(qrImage);
            }

            Paragraph idText = new Paragraph("Certificate ID: " + cert.getCertificateId(), certIdFont);
            idText.setAlignment(Element.ALIGN_CENTER);
            document.add(idText);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage());
        }
    }

    @Override
    public void seedCertificateData(String userId) {
        // Verification is handled inside generate methods
        Event event = eventRepository.findAll().stream().findFirst().orElseGet(() -> {
            Event e = new Event();
            e.setTitle("Introduction to Tech Excellence");
            e.setDescription("Masterclass on modern engineering");
            return eventRepository.save(e);
        });

        Hackathon hackathon = hackathonRepository.findAll().stream().findFirst().orElseGet(() -> {
            Hackathon h = new Hackathon();
            h.setTitle("Global Innovation Hackathon 2024");
            h.setDescription("Build the future with AI");
            return hackathonRepository.save(h);
        });

        generateCertificate(userId, event.getId(), "workshop", "Participant");
        generateHackathonCertificate(userId, hackathon.getId(), "hackathon", "Winner");
    }

    @Override
    public void seedAllCertificates() {
        userRepository.findAll().forEach(user -> {
            try {
                seedCertificateData(user.getId());
            } catch (Exception e) {
                // Silently skip if seeding fails for one user
            }
        });
    }
}
