package com.fundpulse.app.service.proposal;

import com.fundpulse.app.models.Proposal;
import com.fundpulse.app.repositories.ProposalRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProposalStatusUpdater {

    private static final Logger logger = LoggerFactory.getLogger(ProposalStatusUpdater.class);

    private final ProposalRepo proposalRepo;

    public ProposalStatusUpdater(ProposalRepo proposalRepo) {
        this.proposalRepo = proposalRepo;
    }

    // Runs at 00:00, 06:00, 12:00, and 18:00 every day
    @Scheduled(cron = "0 0 */6 * * *")
    public void updateExpiredProposals() {
        LocalDateTime now = LocalDateTime.now();
        logger.info("Running proposal status update check at {}", now);

        Optional<List<Proposal>> byStatus = proposalRepo.findByStatus(true);
        List<Proposal> activeProposals = byStatus.get();
        activeProposals.stream()
                .filter(proposal -> proposal.getEndDate().isBefore(now))
                .forEach(proposal -> {
                    proposal.setStatus(false);
                    proposalRepo.save(proposal);
                    logger.info("Updated status for proposal {} (ID: {}) from active to expired. End date was {}",
                            proposal.getProjectName(),
                            proposal.getProposalId(),
                            proposal.getEndDate());
                });

        logger.info("Proposal status update check completed. {} proposals were processed", activeProposals.size());
    }
}