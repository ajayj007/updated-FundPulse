package com.fundpulse.app.service.investor;

import com.fundpulse.app.ResourseNotFoundExaception;
import com.fundpulse.app.dto.InvestorForm;
import com.fundpulse.app.dto.LoginRequest;
import com.fundpulse.app.dto.UpdateForm;
import com.fundpulse.app.models.Investor;
import com.fundpulse.app.repositories.InvestorRepo;
import com.fundpulse.app.service.document.GoogleDriveUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
        try {
            String email = investorForm.getEmail();
            Optional<Investor> byEmail = investorRepo.findByEmail(email);

            if (byEmail.isPresent()) {
                return ResponseEntity.badRequest().body("Email is already registered.");
            }
            if (!investorForm.getPassword().equals(investorForm.getConfirmPassword())) {
                return ResponseEntity.badRequest().body("Password does not matched.");
            }
            MultipartFile itrFile = investorForm.getItrDocument();
            if (itrFile.isEmpty()) {
                return ResponseEntity.badRequest().body("ITR document is required.");
            }

            boolean isValid = true;
            // You can implement your actual validation logic here
            if (!isValid) {
                return ResponseEntity.badRequest()
                        .body("ITR verification failed. Name mismatch or income below ₹1 crore.");
            }

            Investor investor = getInvestor(investorForm);

            String fileUrl = "";
            try {
                fileUrl = googleDriveUploadService.uploadFile(itrFile, folderId);
                System.out.println("File uploaded successfully: " + fileUrl);
            } catch (IOException e) {
                return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
            }

            investor.setItrUrl(fileUrl);
            investorRepo.save(investor);

            return ResponseEntity.ok().body(investor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing signup: " + e.getMessage());
        }
    }

    public Investor loginInvestor(LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String rawPassword = loginRequest.getPassword(); // User's input password

        System.out.println(email + " " + rawPassword);

        Investor investor = investorRepo.findByEmail(email)
                .orElseThrow(() -> new ResourseNotFoundExaception("Investor not found!"));

        // ✅ Compare raw password with stored hashed password using BCrypt
        if (!encoder.matches(rawPassword, investor.getPassword())) {
            throw new ResourseNotFoundExaception("Invalid credentials!");
        }

        return investor;
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
