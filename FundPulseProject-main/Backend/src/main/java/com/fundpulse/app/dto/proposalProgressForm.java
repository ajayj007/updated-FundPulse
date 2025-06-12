package com.fundpulse.app.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class proposalProgressForm {
    private String proposalId;
    private Long totalGoal;
    private Long raisedAmount;
    private Long remainingAmount;
    private Long minInvestment;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    
}
