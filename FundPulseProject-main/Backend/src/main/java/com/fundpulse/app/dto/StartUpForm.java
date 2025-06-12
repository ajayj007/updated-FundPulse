package com.fundpulse.app.dto;

import lombok.Data;

@Data
public class StartUpForm {


    private String founderName;
    private String email;
    private String phone;
    private String countryCode;
    private String password;
    private String confirmPassword;
    private String industryCategories;
    private String fundingGoal;
    private String currency;

//    private byte[] pitchVideo;
}
