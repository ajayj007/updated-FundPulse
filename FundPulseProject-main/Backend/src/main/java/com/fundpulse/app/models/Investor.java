package com.fundpulse.app.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "investors")
public class Investor implements UserDetails {
    @Id
    private String investorId;

    private String fullName;
    private String email;
    private String phone;
    private String password;
//    private String investmentCategories;
    private double declaredIncome; // From user input
    private double extractedIncome; // Extracted from ITR
    private boolean verified; // True if the document passes verification
    private double coin;
    private String itrUrl; // Storing the document as a URL reference

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return this.email;
    }
}