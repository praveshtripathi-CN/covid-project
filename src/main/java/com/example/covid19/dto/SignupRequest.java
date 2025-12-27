package com.example.covid19.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String password;
}
