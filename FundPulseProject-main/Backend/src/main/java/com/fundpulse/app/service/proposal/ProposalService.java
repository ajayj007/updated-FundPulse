package com.fundpulse.app.service.proposal;

import com.fundpulse.app.dto.ProposalForm;
import com.fundpulse.app.models.Proposal;
import com.fundpulse.app.models.Startup;
import com.fundpulse.app.repositories.ProposalRepo;
import com.fundpulse.app.repositories.StartupRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProposalService {

    @Autowired
    private StartupRepo startupRepo;

    @Autowired
    private ProposalRepo proposalRepo;

    public ResponseEntity<Proposal> addProposal(ProposalForm proposalForm, Long id, String walletAddress) {
        Optional<Startup> startupById = startupRepo.findById(String.valueOf(id));

        if (startupById.isPresent()) {

            Startup startup = startupById.get();
            Proposal proposal = getProposal(proposalForm, startup);

            Proposal savedProposal = proposalRepo.save(proposal);
            System.out.println(savedProposal.getProposalId());
            startup.setProposalId(savedProposal.getProposalId());
            startupRepo.save(startup);
            return ResponseEntity.ok().body(proposal);
        } else {
            System.out.println("user is not available");
            return ResponseEntity.notFound().build();
        }

    }

    public ResponseEntity<List<Proposal>> getDisabledProposals(String startupId) {
        Optional<List<Proposal>> proposals = proposalRepo.findByStartUpId(startupId);
        List<Proposal> proposals2 = proposals.get();
        System.out.println(proposals2);
        return ResponseEntity.ok().body(proposals2);

    }

    private static Proposal getProposal(ProposalForm proposalForm, Startup startup) {
        Proposal proposal = new Proposal();

        proposal.setStartUpId(startup.getStartupId());
        proposal.setProjectName(proposalForm.getProjectName());
        proposal.setAmountToRaise(proposalForm.getAmountToRaise());
        proposal.setEquityPercentage(proposalForm.getEquityPercentage());
        proposal.setReason(proposalForm.getReason());
        proposal.setSector(proposalForm.getSector());
        proposal.setStartDate(proposalForm.getStartDate());
        proposal.setEndDate(proposalForm.getEndDate());
        proposal.setMinInvestment(proposalForm.getAmountToRaise() / 2);
        proposal.setRaisedAmount(0L);
        proposal.setSector(proposalForm.getSector());
        proposal.setWalletAddress(proposal.getWalletAddress());
        proposal.setStatus(true);
        return proposal;
    }

    public ResponseEntity<?> getActiveProposals(String startupId) {
        Optional<List<Proposal>> byStatus = proposalRepo.findByStatusAndStartUpId(true, startupId);
        List<Proposal> proposals = byStatus.get();
        if (proposals.size() >= 1) {
            return ResponseEntity.ok().body(proposals);
        } else {
            return ResponseEntity.ok().body(null);
        }
    }

    public ResponseEntity<List<Proposal>> getAllActiveProposals() {
        Optional<List<Proposal>> byStatus = proposalRepo.findByStatus(true);
        if (byStatus.isPresent()) {
            List<Proposal> proposals = byStatus.get();
            return ResponseEntity.ok().body(proposals);
        } else {
            return ResponseEntity.ok().body(null);
        }
    }

    public void endProposal(String proposalId) {
        Optional<Proposal> byId = proposalRepo.findById(proposalId);
        if (byId.isPresent()) {
            Proposal proposal = byId.get();
            proposal.setStatus(false);
            proposalRepo.save(proposal);

        }
    }

    public Proposal createProposal(String startupId, ProposalForm proposal, String walletAddress) {

        Proposal proposal1 = new Proposal();

        proposal1.setStartUpId(String.valueOf(startupId));
        proposal1.setProjectName(proposal.getProjectName());
        proposal1.setAmountToRaise(proposal.getAmountToRaise());
        proposal1.setEquityPercentage(proposal.getEquityPercentage());
        proposal1.setReason(proposal.getReason());
        proposal1.setSector(proposal.getSector());
        proposal1.setStartDate(proposal.getStartDate());
        proposal1.setEndDate(proposal.getEndDate());
        proposal1.setMinInvestment(proposal.getAmountToRaise() / 2);
        proposal1.setRaisedAmount(0L);
        proposal1.setSector(proposal.getSector());
        proposal1.setStatus(true);
        proposal1.setWalletAddress(walletAddress);
        proposalRepo.save(proposal1);
        return proposal1;
    }


    // private boolean canSubmitProposal(String id){

    // Optional<Proposal> activeProposal =
    // proposalRepo.findByStartupAndStatus(id,"Active");
    //
    // return true;
    // }
}
