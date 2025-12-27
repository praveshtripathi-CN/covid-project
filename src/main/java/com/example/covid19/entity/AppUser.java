package com.example.covid19.entity;

import com.example.covid19.security.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "app_users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;          // will be login username

    @Column(nullable = false)
    private String password;       // bcrypt

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;             // ROLE_ADMIN / ROLE_USER

    private boolean enabled;       // after signup-OTP = true

    // for single active session
    private String currentToken;   // latest JWT
    private Instant tokenIssuedAt; // when token created
}
