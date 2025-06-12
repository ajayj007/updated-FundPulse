package com.fundpulse.app.service.investment;

import com.fundpulse.app.dto.InvestmentForm;
import com.fundpulse.app.models.Investment;
import com.fundpulse.app.models.Investor;
import com.fundpulse.app.models.Proposal;
import com.fundpulse.app.repositories.InvestmentRepo;
import com.fundpulse.app.repositories.InvestorRepo;
import com.fundpulse.app.repositories.ProposalRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class InvestmentService {

    @Autowired
    private InvestmentRepo investmentRepo;

    @Autowired
    private ProposalRepo proposalRepo;

    @Autowired
    private InvestorRepo investorRepo;

    public ResponseEntity<?> makeInvestment(InvestmentForm investmentForm) {
        try {
            // Check if investor already has an investment in this proposal
            Optional<Investment> existingInvestment = investmentRepo.findByInvestorIdAndProposalId(
                    investmentForm.getInvestorId(),
                    investmentForm.getProposalId()
            );

            Proposal proposal = proposalRepo.findById(investmentForm.getProposalId())
                    .orElseThrow(() -> new RuntimeException("Proposal not found"));

            if (existingInvestment.isPresent()) {
                // Investor already invested - update the existing investment
                Investment investment = existingInvestment.get();
                Long previousAmount = investment.getAmount();
                Long newAmount = investmentForm.getAmount();

                // Update investment amount
                investment.setAmount(previousAmount + newAmount);
                investment.setInvestmentDate(LocalDateTime.now());
                Investment updatedInvestment = investmentRepo.save(investment);

                // Update proposal's raised amount (add just the new amount)
                proposal.setRaisedAmount(proposal.getRaisedAmount() + newAmount);
                proposalRepo.save(proposal);

                return ResponseEntity.ok(updatedInvestment);
            } else {
                // New investment
                Investment investment = new Investment();
                investment.setInvestorId(investmentForm.getInvestorId());
                investment.setProposalId(investmentForm.getProposalId());
                investment.setAmount(investmentForm.getAmount());
                investment.setInvestmentDate(LocalDateTime.now());

                // Save the investment
                Investment savedInvestment = investmentRepo.save(investment);

                // Update the proposal's raised amount
                proposal.setRaisedAmount(proposal.getRaisedAmount() + investmentForm.getAmount());
                proposalRepo.save(proposal);

                return ResponseEntity.ok(savedInvestment);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error making investment: " + e.getMessage());
        }
    }

    public List<Map<String, Object>> getInvestments(String investorId) {
        try {
            // 1. Get all investments for the investor
            List<Investment> investments = investmentRepo.findByInvestorId(investorId);

            if (investments.isEmpty()) {
                return null;
            }

            // 2. Create a list to hold the enriched investment data
            List<Map<String, Object>> investmentData = new ArrayList<>();

            // 3. For each investment, get the proposal details and format the response
            for (Investment investment : investments) {
                Proposal proposal = proposalRepo.findById(investment.getProposalId())
                        .orElseThrow(() -> new RuntimeException(
                                "Proposal not found for ID: " + investment.getProposalId()
                        ));

                // Calculate equity percentage (investment amount / total amount to raise * equity offered)
                double equityPercentage = ((double)investment.getAmount() / (double)proposal.getAmountToRaise()) * (double) proposal.getEquityPercentage();

                System.out.println(investment.getAmount() );
                System.out.println(proposal.getAmountToRaise() );
                System.out.println(proposal.getEquityPercentage());
                System.out.println(equityPercentage);

                Map<String, Object> investmentDetails = new HashMap<>();
                investmentDetails.put("investmentId", investment.getInvestmentId());
                investmentDetails.put("projectName", proposal.getProjectName());
                investmentDetails.put("projectDescription", proposal.getReason());
                investmentDetails.put("projectSector", proposal.getSector());
                investmentDetails.put("totalInvested", investment.getAmount());
                investmentDetails.put("equityPercentage", equityPercentage);

                investmentDetails.put("investmentDate", investment.getInvestmentDate());

                investmentData.add(investmentDetails);
            }

            return investmentData;
        } catch (Exception e) {
            return null;
        }
    }

    public ResponseEntity<?> getAllInvested(String investorId) {
        List<Investment> investments = investmentRepo.findByInvestorId(investorId);
        Map<String,Long> map = new HashMap<>();
        if (investments.isEmpty()) {
            map.put("totalInvested",0L);
            map.put("activeInvestments",0L);
            return ResponseEntity.ok().body(map);
        }
        Long total = 0L;
        Long count = 0L;
        for (Investment investment : investments) {
            total += investment.getAmount();
            count+=1;
        }
        map.put("totalInvested",total);
        map.put("activeInvestments",count);
        return ResponseEntity.ok().body(map);
    }

    public ResponseEntity<?> getInvestors(String proposalId) {
        try {
            // 1. Verify the proposal exists and get its details
            Proposal proposal = proposalRepo.findById(proposalId)
                    .orElseThrow(() -> new RuntimeException("Proposal not found with id: " + proposalId));

            // 2. Get all investments for this proposal
            Optional<List<Investment>> investments = investmentRepo.findByProposalId(proposalId);

            // 3. Create a list to hold simplified investor data
            List<Map<String, Object>> investorData = new ArrayList<>();

            for (Investment investment : investments.get()) {
                // Fetch investor name (assuming you have an InvestorRepository)

                Optional<Investor> byId = investorRepo.findById(investment.getInvestorId());

               if(byId.isPresent()){
                   Investor investor = byId.get();
                   String investorName = investor.getFullName();

                   // Calculate equity percentage
                   double equityPercentage = ((double) investment.getAmount() / (double) proposal.getAmountToRaise()) * (double) proposal.getEquityPercentage();

                   // Create a map with only the required fields
                   Map<String, Object> investorInfo = new HashMap<>();
                   investorInfo.put("name", investorName);
                   investorInfo.put("amountInvested", investment.getAmount());
                   investorInfo.put("equityPercentage", equityPercentage);
                   investorInfo.put("investmentDate", investment.getInvestmentDate());

                   investorData.add(investorInfo);
               }
            }

            // 4. Return the simplified investor data
            return ResponseEntity.ok(investorData);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving investors: " + e.getMessage());
        }
    }
}
