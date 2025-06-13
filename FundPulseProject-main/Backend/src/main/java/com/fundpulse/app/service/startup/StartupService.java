package com.fundpulse.app.service.startup;

import com.fundpulse.app.ResourseNotFoundExaception;
import com.fundpulse.app.dto.*;
import com.fundpulse.app.models.Startup;
import com.fundpulse.app.repositories.StartupRepo;
import com.fundpulse.app.service.auth.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StartupService {

    @Autowired
    private StartupRepo startupRepo;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private JWTService jwtService;

    private Startup getStartup(StartUpForm startUpForm) {
        Startup startup = new Startup();
        startup.setFounderName(startUpForm.getFounderName());
        startup.setEmail(startUpForm.getEmail());
        startup.setPhone(startUpForm.getCountryCode() + " " + startUpForm.getPhone());
        startup.setPassword(encoder.encode(startUpForm.getPassword())); // ✅ Encrypt password before saving
        // startup.setIndustryCategories(startUpForm.getIndustryCategories());
        // startup.setFundingGoal(startUpForm.getCurrency() + " " +
        // startUpForm.getFundingGoal());
        return startup;
    }

    public ResponseEntity<String> registerStartup(StartUpForm startUpForm) {
        try {
            Startup startup = getStartup(startUpForm);
            startupRepo.save(startup);
            return ResponseEntity.ok("Startup registered successfully and verified.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing signup: " + e.getMessage());
        }
    }

    public StartupLoginResponse loginStartup(LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String rawPassword = loginRequest.getPassword();

        Startup startup = startupRepo.findByEmail(email)
                .orElseThrow(() -> new ResourseNotFoundExaception("Startup not found!"));

        if (!encoder.matches(rawPassword, startup.getPassword())) {
            throw new ResourseNotFoundExaception("Invalid credentials!");
        }

        String token = jwtService.generateToken(startup.getEmail());

        return new StartupLoginResponse(token, startup.getStartupId());
    }


    public ResponseEntity<?> getStartupById(String startupId) {
        Optional<Startup> byId = startupRepo.findById(startupId);
        Startup startup = byId.get();
        return ResponseEntity.ok().body(startup);

    }

    public ResponseEntity<?> updateStartupProfile(UpdateForm startupUpdateForm, String startupId) {
        Optional<Startup> byId = startupRepo.findById(startupId);

        Startup startup = byId.get();
        startup.setFounderName(startupUpdateForm.getFullName());
        startup.setPhone(startupUpdateForm.getPhone());

        startupRepo.save(startup);
        return ResponseEntity.ok().body(startup);
    }

    public boolean updatePassword(String startupId, String currentPassword, String newPassword) {
        Optional<Startup> startupOpt = startupRepo.findById(startupId);

        if (startupOpt.isEmpty()) {
            return false;
        }

        Startup startup = startupOpt.get();

        // Verify current password matches
        if (!encoder.matches(currentPassword, startup.getPassword())) {
            return false;
        }

        // Update password
        startup.setPassword(encoder.encode(newPassword));
        startupRepo.save(startup);
        return true;
    }
}
