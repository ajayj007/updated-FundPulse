package com.fundpulse.app.controller;

import com.fundpulse.app.dto.InvestmentForm;
import com.fundpulse.app.service.investment.InvestmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/investment")
public class InvestmentController {
    @Autowired
    private InvestmentService investmentService;

    @PostMapping("/invest")
    public ResponseEntity<?> makeInvestment(
            @RequestBody InvestmentForm investmentForm) {
        return investmentService.makeInvestment(investmentForm);
    }

    @GetMapping("/get")
    public ResponseEntity<?> getInvestments(@RequestParam String investorId) {
        List<Map<String, Object>> investments = investmentService.getInvestments(investorId);
        if (investments != null) {
            return ResponseEntity.ok().body(investments);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No investments found for investor ID: " + investorId);
        }

    }

    @GetMapping("/get-invested")
    public ResponseEntity<?> getTotalInvested(@RequestParam String investorId) {
        return investmentService.getAllInvested(investorId);
    }

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentInvestments(@RequestParam String investorId) {
        List<Map<String, Object>> investments = investmentService.getInvestments(investorId);

        if (investments != null) {
            List<Map<String, Object>> firstThree = investments.subList(0, Math.min(investments.size(), 3));
            return ResponseEntity.ok().body(firstThree);
        }
        return ResponseEntity.ok().body(null);

    }

    @GetMapping("/get-investors")
    public ResponseEntity<?> getInvestors(@RequestParam String proposalId) {
        return investmentService.getInvestors(proposalId);
    }
}
