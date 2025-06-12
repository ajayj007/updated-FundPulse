package com.fundpulse.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class InvestorForm {
    private String fullName;
    private String email;
    private String countryCode;
    private String phone;
    private String password;
    private String confirmPassword;
    private String investmentCategories;
    private double declaredIncome;

    private MultipartFile itrDocument;

}
