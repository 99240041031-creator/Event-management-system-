package com.eventmanager.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class QRCodeGenerator {
    
    private static final int QR_CODE_SIZE = 300;
    
    /**
     * Generate QR code image (static method for quick util usage)
     */
    public static String generateQRCodeImage(String text, int width, int height) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        byte[] pngData = pngOutputStream.toByteArray();
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(pngData);
    }
    
    /**
     * Generate a unique verification code for certificates
     */
    public String generateVerificationCode() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }
    
    /**
     * Generate QR code image as Base64 string
     */
    public String generateQRCodeBase64(String data) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(EncodeHintType.MARGIN, 1);
        
        BitMatrix bitMatrix = qrCodeWriter.encode(data, BarcodeFormat.QR_CODE, QR_CODE_SIZE, QR_CODE_SIZE, hints);
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        
        byte[] qrCodeBytes = outputStream.toByteArray();
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(qrCodeBytes);
    }
    
    /**
     * Generate verification URL for certificate
     */
    public String generateVerificationUrl(String certificateId, String verificationCode, String baseUrl) {
        return String.format("%s/verify-certificate/%s/%s", baseUrl, certificateId, verificationCode);
    }
    
    /**
     * Generate QR code for certificate verification
     */
    public String generateCertificateQRCode(String certificateId, String verificationCode, String baseUrl) 
            throws WriterException, IOException {
        String verificationUrl = generateVerificationUrl(certificateId, verificationCode, baseUrl);
        return generateQRCodeBase64(verificationUrl);
    }
}
