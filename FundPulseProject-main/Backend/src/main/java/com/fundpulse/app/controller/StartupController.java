package com.fundpulse.app.controller;

import com.fundpulse.app.dto.*;
import com.fundpulse.app.models.Proposal;
import com.fundpulse.app.models.Startup;
import com.fundpulse.app.service.proposal.ProposalService;

import com.fundpulse.app.service.startup.StartupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/startup")
public class StartupController {

    @Autowired
    private StartupService startupService;

    @Autowired
    private ProposalService proposalService;

    @PostMapping(value = "/signup")
    public ResponseEntity<String> registerSignup(@RequestBody StartUpForm startUpForm) {
        System.out.println("Received request in registerSignup()");
        System.out.println("Signup Email: " + startUpForm.getEmail());
        return startupService.registerStartup(startUpForm);
    }

    @PostMapping("/login")
    public Startup LoginInvestor(@RequestBody LoginRequest loginRequest) {

        Startup startup = startupService.loginStartup(loginRequest);
        return startup;

    }

    @PostMapping("/add-proposal/{startupId}")
    public ResponseEntity<?> addProposal(
            @PathVariable String startupId,
            @RequestBody ProposalForm proposal,
            @RequestParam String walletAddress
    ) {
        System.out.println(walletAddress+" wallet");
        Proposal savedProposal = proposalService.createProposal(startupId, proposal, walletAddress);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Proposal created successfully");

        response.put("startupWalletAddress", walletAddress); // ✅ Correct

        return ResponseEntity.ok(response);
    }


    @GetMapping("/{startupId}")
    public ResponseEntity<?> getInvestor(@PathVariable String startupId) {
        return startupService.getStartupById(startupId);

    }

    @PutMapping("/update/{startupId}")
    public ResponseEntity<?> updateProfile(@PathVariable String startupId, @RequestBody UpdateForm startupUpdateForm) {
        return startupService.updateStartupProfile(startupUpdateForm, startupId);
    }

    @PutMapping("/{startupId}/password")
    public ResponseEntity<String> updatePassword(
            @PathVariable String startupId,
            @RequestBody PasswordUpdateRequest passwordUpdateRequest) {

        // Validate new password length
        if (passwordUpdateRequest.getNewPassword() == null ||
                passwordUpdateRequest.getNewPassword().length() < 8) {
            return ResponseEntity.badRequest().body("New password must be at least 8 characters");
        }

        // Update password
        boolean success = startupService.updatePassword(startupId,
                passwordUpdateRequest.getCurrentPassword(),
                passwordUpdateRequest.getNewPassword());

        if (success) {
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.badRequest().body("Current password is incorrect or user not found");
        }
    }

}
