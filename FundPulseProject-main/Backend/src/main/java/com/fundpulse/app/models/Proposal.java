package com.fundpulse.app.models;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "proposals")
public class Proposal {

    @Id
    private String proposalId;

    @Indexed(unique =true)
    private String startUpId;
    private String projectName;
    private Long amountToRaise;
    private int equityPercentage;
    private String reason;
    private String sector;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long raisedAmount ;
    private Long minInvestment;
    private String walletAddress;
    private boolean status;

}
