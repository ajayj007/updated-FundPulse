package com.fundpulse.app.service.itrVerification;

import net.sourceforge.tess4j.TesseractException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ITRValidationService {

    private static final Logger logger = LoggerFactory.getLogger(ITRValidationService.class);

    @Autowired
    private TesseractOCRService ocrService;


    public boolean isITRDocument(MultipartFile file) throws IOException, TesseractException {
        // Extract text from the file using OCR
        String extractedText = ocrService.extractTextFromFile(file);

        if (extractedText == null || extractedText.trim().isEmpty()) {
            logger.warn("OCR Extraction Failed or Returned Empty Text!");
            return false;
        }

        logger.info("Full Extracted PDF Text:\n{}", extractedText);

        // Normalize text: Remove extra spaces & convert to lowercase
        String normalizedText = extractedText.toLowerCase().replaceAll("\\s+", " ");

        // Check if key phrases exist
        boolean containsAssessmentYear = normalizedText.contains("assessment year");
        boolean containsAcknowledgementNumber = normalizedText.contains("acknowledgement number");

        // Extract PAN number from the text
        String extractedPAN = extractPAN(extractedText);
        boolean containsPAN = extractedPAN != null;

        logger.info("Contains 'Assessment Year'?: {}", containsAssessmentYear);
        logger.info("Contains 'Acknowledgement Number'?: {}", containsAcknowledgementNumber);
        logger.info("Extracted PAN: {}", extractedPAN);

        // Return true only if PAN, Assessment Year, and Acknowledgement Number are present
        return containsAssessmentYear && containsAcknowledgementNumber && containsPAN;

    }

    /**
     * Extract PAN Number from the OCR text using regex.
     */
    private String extractPAN(String text) {
        // Improved regex to find PAN, even if prefixed with "permanent account number"
        Pattern panPattern = Pattern.compile("(?:permanent account number\\s*)?([A-Z]{5}[0-9]{4}[A-Z])", Pattern.CASE_INSENSITIVE);
        Matcher matcher = panPattern.matcher(text);

        if (matcher.find()) {
            return matcher.group(1); // Extract the PAN number only
        }
        return null; // Return null if no PAN is found
    }
}
