package com.fundpulse.app.service.document;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentVerificationService {

    public boolean validateITR(MultipartFile file, String fullName, double declaredIncome) {
        // Step 1: Extract name & income from ITR document
        String extractedName = extractTextFromITR(file);
        double extractedIncome = extractIncomeFromITR(file);

        // Step 2: Check if extracted name matches provided full name
        boolean isNameMatching = extractedName.equalsIgnoreCase(fullName);

        // Step 3: Verify income threshold (₹1 Crore)
        boolean isIncomeValid = extractedIncome >= 10000000;

        // Step 4: Return validation result
        return isNameMatching && isIncomeValid;
    }

    private String extractTextFromITR(MultipartFile file) {
        return "Investor Name"; // Dummy value
    }

    private double extractIncomeFromITR(MultipartFile file) {
        return 12000000; // Dummy value
    }
}