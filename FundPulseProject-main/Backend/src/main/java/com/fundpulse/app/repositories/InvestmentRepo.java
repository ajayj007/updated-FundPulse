package com.fundpulse.app.repositories;

import com.fundpulse.app.models.Investment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestmentRepo extends MongoRepository<Investment, String> {
    
    Optional<List<Investment>> findByProposalId(String proposalId);

    List<Investment> findByInvestorId(String investorId);

    Optional<Investment> findByInvestorIdAndProposalId(String investorId, String proposalId);
}
