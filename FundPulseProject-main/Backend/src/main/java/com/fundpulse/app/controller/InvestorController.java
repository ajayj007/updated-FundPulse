package com.fundpulse.app.controller;

import com.fundpulse.app.dto.*;
import com.fundpulse.app.models.Investor;
import com.fundpulse.app.service.investor.InvestorService;
import com.fundpulse.app.service.itrVerification.ITRValidationService;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/investor")
public class InvestorController {

    @Autowired
    private InvestorService investorService;

    @Autowired
    private ITRValidationService itrValidationService;
    @PostMapping("/login")
    public ResponseEntity<?> loginInvestor(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email and password are required.");
        }

        try {
            LoginResponse loginResponse = investorService.loginInvestor(loginRequest);
            if (loginResponse != null) {
                return ResponseEntity.ok(loginResponse);
            } else {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email or password.");
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while processing your request.");
        }
    }


    @PostMapping(value = "/signup")
    public ResponseEntity<?> registerInvestor(@ModelAttribute InvestorForm investorForm) {
         MultipartFile itrDocument = investorForm.getItrDocument();
        if (itrDocument == null || itrDocument.isEmpty()) {
            return ResponseEntity.badRequest().body("ITR Document is required for registration.");
        }

        // 2. Validate ITR document using OCR
        try {
            boolean isValid = itrValidationService.isITRDocument(itrDocument);
            if (!isValid) {
                return ResponseEntity.badRequest().body("Uploaded ITR document is not valid.");
            }
        } catch (IOException | TesseractException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing ITR document: " + e.getMessage());
        }
        System.out.println("Received request in registerInvestor()");
        System.out.println("Investor Email: " + investorForm.getEmail());
        return investorService.registerInvestor(investorForm);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllInvestors(){
        return investorService.getInvestors();
    }

    @GetMapping("/{investorId}")
    public ResponseEntity<?> getInvestor(@PathVariable String investorId){
        return investorService.getInvestorById(investorId);

    }

    @PutMapping("/update/{investorId}")
    public ResponseEntity<?> updateProfile(@PathVariable String investorId, @RequestBody UpdateForm investorUpdateForm) {
        return investorService.updateInvestorProfile(investorUpdateForm,investorId);
    }

    @PutMapping("/{investorId}/password")
    public ResponseEntity<String> updatePassword(
            @PathVariable String investorId,
            @RequestBody PasswordUpdateRequest passwordUpdateRequest) {

        // Validate new password length
        if (passwordUpdateRequest.getNewPassword() == null ||
                passwordUpdateRequest.getNewPassword().length() < 8) {
            return ResponseEntity.badRequest().body("New password must be at least 8 characters");
        }

        // Update password
        boolean success = investorService.updatePassword(investorId,
                passwordUpdateRequest.getCurrentPassword(),
                passwordUpdateRequest.getNewPassword());

        if (success) {
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.badRequest().body("Current password is incorrect or user not found");
        }
    }



}