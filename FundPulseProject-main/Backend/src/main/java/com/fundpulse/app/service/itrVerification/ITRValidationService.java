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
        // Extract text from uploaded file
        String extractedText = ocrService.extractTextFromFile(file);

        if (extractedText == null || extractedText.trim().isEmpty()) {
            logger.warn("OCR extraction failed or returned empty text");
            return false;
        }

        logger.info("Extracted OCR Text:\n{}", extractedText);

        // Normalize for keyword checks
        String normalizedText = extractedText.toLowerCase().replaceAll("\\s+", " ");

        // Check key elements
        boolean containsAssessmentYear = normalizedText.contains("assessment year");
        boolean containsAcknowledgementNumber = normalizedText.contains("acknowledgement number");
        boolean containsPAN = extractPAN(extractedText) != null;
        boolean incomeAboveThreshold = isIncomeAboveThreshold(extractedText);

        logger.info("Contains Assessment Year: {}", containsAssessmentYear);
        logger.info("Contains Acknowledgement Number: {}", containsAcknowledgementNumber);
        logger.info("PAN found: {}", containsPAN);
        logger.info("Income above ₹1 lakh: {}", incomeAboveThreshold);

        // Final validation
        return containsAssessmentYear && containsAcknowledgementNumber && containsPAN && incomeAboveThreshold;
    }

    /**
     * Extract PAN Number from OCR text using regex.
     */
    private String extractPAN(String text) {
        Pattern panPattern = Pattern.compile("(?:permanent account number\\s*)?([A-Z]{5}[0-9]{4}[A-Z])", Pattern.CASE_INSENSITIVE);
        Matcher matcher = panPattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    /**
     * Check if the extracted total income is above ₹1,00,000.
     */
    private boolean isIncomeAboveThreshold(String text) {
        // Match lines like: Total Income  20 — not ones with more content like "Total Donations"
        Pattern pattern = Pattern.compile("(?m)^\\s*Total\\s+Income\\s+(\\d[\\d,]*)\\s*$");
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            String incomeStr = matcher.group(1).replaceAll(",", "");
            try {
                double income = Double.parseDouble(incomeStr);
                logger.info("Extracted Final Total Income (from strict match): {}", income);
                return income >= 20;
            } catch (NumberFormatException e) {
                logger.warn("Failed to parse total income: {}", incomeStr);
            }
        } else {
            logger.warn("Strict match for 'Total Income' not found");
        }

        return false;
    }


}
