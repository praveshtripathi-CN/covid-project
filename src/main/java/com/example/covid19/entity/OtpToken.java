package com.example.covid19.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "otp_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;          // user email
    private String code;           // 6-digit OTP
    private Instant expiresAt;     // now + 5 min
    private boolean used;

    @Column(nullable = false)
    private String purpose;        // "SIGNUP" or "LOGIN"

    // used only for SIGNUP to temporarily hold encoded password
    private String encodedPassword;
}
