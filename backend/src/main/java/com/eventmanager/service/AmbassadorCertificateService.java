package com.eventmanager.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.PdfContentByte;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.eventmanager.model.User;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;

@Service
public class AmbassadorCertificateService {

    public byte[] generateAmbassadorCertificate(User ambassador, Integer rank, Integer totalReferrals) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter writer = PdfWriter.getInstance(document, out);
        
        document.open();
        
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 36, Font.BOLD);
        Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, Font.BOLD);
        Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 16, Font.NORMAL);

        Paragraph title = new Paragraph("CERTIFICATE OF EXCELLENCE", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);
        
        Paragraph subTitle = new Paragraph("This is proudly presented to", bodyFont);
        subTitle.setAlignment(Element.ALIGN_CENTER);
        document.add(subTitle);
        document.add(Chunk.NEWLINE);
        
        Paragraph name = new Paragraph(ambassador.getFirstName() + " " + ambassador.getLastName(), nameFont);
        name.setAlignment(Element.ALIGN_CENTER);
        document.add(name);
        document.add(Chunk.NEWLINE);

        Paragraph reason = new Paragraph(
            String.format("For outstanding performance as an Official Nexus Ambassador.\nAchieving Rank #%d with %d successful global referrals.", rank, totalReferrals),
            bodyFont
        );
        reason.setAlignment(Element.ALIGN_CENTER);
        document.add(reason);
        document.add(Chunk.NEWLINE);
        
        Paragraph date = new Paragraph("Issued on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")), bodyFont);
        date.setAlignment(Element.ALIGN_CENTER);
        document.add(date);

        // Generate QR code for verification
        String verificationUrl = "https://nexus-platform.com/verify/ambassador/" + ambassador.getId();
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(verificationUrl, BarcodeFormat.QR_CODE, 150, 150);
        
        ByteArrayOutputStream qrOut = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", qrOut);
        
        Image qrImage = Image.getInstance(qrOut.toByteArray());
        qrImage.setAbsolutePosition(100, 100);
        document.add(qrImage);

        document.close();
        return out.toByteArray();
    }
}
