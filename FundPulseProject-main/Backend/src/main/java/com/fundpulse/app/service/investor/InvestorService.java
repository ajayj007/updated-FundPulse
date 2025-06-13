package com.fundpulse.app.service.investor;

import com.fundpulse.app.ResourseNotFoundExaception;
import com.fundpulse.app.dto.InvestorForm;
import com.fundpulse.app.dto.LoginRequest;
import com.fundpulse.app.dto.LoginResponse;
import com.fundpulse.app.dto.UpdateForm;
import com.fundpulse.app.models.Investor;
import com.fundpulse.app.repositories.InvestorRepo;
import com.fundpulse.app.service.auth.JWTService;
import com.fundpulse.app.service.document.GoogleDriveUploadService;
import com.fundpulse.app.service.itrVerification.ITRValidationService;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class InvestorService {

    @Value("${folderId}")
    String folderId;

    @Autowired
    private InvestorRepo investorRepo;

    @Autowired
    private GoogleDriveUploadService googleDriveUploadService;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private ITRValidationService itrValidationService;

    private Investor getInvestor(InvestorForm investorForm) {
        Investor investor = new Investor();
        investor.setFullName(investorForm.getFullName());
        investor.setEmail(investorForm.getEmail());
        investor.setPhone(investorForm.getCountryCode() + " " + investorForm.getPhone());
        investor.setPassword(encoder.encode(investorForm.getPassword())); // ✅ Encrypt password before saving
        // investor.setInvestmentCategories(investorForm.getInvestmentCategories());
        investor.setDeclaredIncome(investorForm.getDeclaredIncome());
        investor.setExtractedIncome(12000000); // Dummy extracted value
        investor.setVerified(true); // Verified as income >= ₹1 crore
        return investor;
    }

    public ResponseEntity<?> registerInvestor(InvestorForm investorForm) {
        MultipartFile itrDocument = investorForm.getItrDocument();

        // Basic validations
        if (itrDocument == null || itrDocument.isEmpty()) {
            return ResponseEntity.badRequest().body("ITR Document is required for registration.");
        }

        if (!investorForm.getPassword().equals(investorForm.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Password and Confirm Password do not match.");
        }

        Optional<Investor> existingInvestor = investorRepo.findByEmail(investorForm.getEmail());
        if (existingInvestor.isPresent()) {
            return ResponseEntity.badRequest().body("Email is already registered.");
        }

        // ITR Validation
        try {
            boolean isValid = itrValidationService.isITRDocument(itrDocument);
            if (!isValid) {
                return ResponseEntity.badRequest().body("Uploaded ITR is invalid or income < ₹1 lakh.");
            }
        } catch (IOException | TesseractException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error validating ITR: " + e.getMessage());
        }

        // Upload ITR to Google Drive
        String fileUrl = "abcd";


        // Save investor
        try {
            Investor investor = getInvestor(investorForm);
            investor.setItrUrl(fileUrl);
            investorRepo.save(investor);
            return ResponseEntity.ok().body(investor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving investor: " + e.getMessage());
        }
    }
    public LoginResponse loginInvestor(LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String rawPassword = loginRequest.getPassword();

        Investor investor = investorRepo.findByEmail(email)
                .orElseThrow(() -> new ResourseNotFoundExaception("Investor not found!"));

        if (!encoder.matches(rawPassword, investor.getPassword())) {
            throw new ResourseNotFoundExaception("Invalid credentials!");
        }

        String token = jwtService.generateToken(investor.getEmail());

        return new LoginResponse(token, investor.getInvestorId());
    }


    public ResponseEntity<?> getInvestors() {
        List<Investor> all = investorRepo.findAll();
        return ResponseEntity.ok().body(all);
    }

    public ResponseEntity<?> getInvestorById(String investorId) {
        Optional<Investor> byId = investorRepo.findById(investorId);
        Investor investor = byId.get();
        return ResponseEntity.ok().body(investor);

    }

    public ResponseEntity<?> updateInvestorProfile(UpdateForm investorUpdateForm, String investorId) {
        Optional<Investor> byId = investorRepo.findById(investorId);

        Investor investor = byId.get();
        investor.setFullName(investorUpdateForm.getFullName());
        investor.setPhone(investorUpdateForm.getPhone());

        investorRepo.save(investor);
        return ResponseEntity.ok().body(investor);
    }

    public boolean updatePassword(String investorId, String currentPassword, String newPassword) {
        Optional<Investor> investorOpt = investorRepo.findById(investorId);

        if (investorOpt.isEmpty()) {
            return false;
        }

        Investor investor = investorOpt.get();

        // Verify current password matches
        if (!encoder.matches(currentPassword, investor.getPassword())) {
            return false;
        }

        // Update password
        investor.setPassword(encoder.encode(newPassword));
        investorRepo.save(investor);
        return true;
    }
}
