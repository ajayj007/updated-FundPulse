package com.fundpulse.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProposalForm {

    private String projectName;
    private Long amountToRaise;
    private String reason;
    private int equityPercentage;
    private String sector;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long minInvestment;
    private String startupWalletAddress;
}
