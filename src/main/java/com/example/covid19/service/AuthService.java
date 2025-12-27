package com.example.covid19.service;

import com.example.covid19.dto.*;
import com.example.covid19.entity.AppUser;
import com.example.covid19.entity.OtpToken;
import com.example.covid19.repository.AppUserRepository;
import com.example.covid19.repository.OtpTokenRepository;
import com.example.covid19.security.JwtService;
import com.example.covid19.security.Role;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Random;

@Service
public class AuthService {

    private final AppUserRepository userRepo;
    private final OtpTokenRepository otpRepo;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final JwtService jwtService;

    public AuthService(AppUserRepository userRepo, OtpTokenRepository otpRepo,
                       PasswordEncoder passwordEncoder,
                       MailService mailService, JwtService jwtService) {
        this.userRepo = userRepo;
        this.otpRepo = otpRepo;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
        this.jwtService = jwtService;
    }

    private String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000); // 6-digit
    }

    // ---- SIGNUP ----
    public void signup(SignupRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists!");
        }

        String otp = generateOtp();

        OtpToken otpToken = OtpToken.builder()
                .email(req.getEmail())
                .code(otp)
                .purpose("SIGNUP")
                .expiresAt(Instant.now().plusSeconds(300)) // 5 mins
                .used(false)
                .encodedPassword(passwordEncoder.encode(req.getPassword()))
                .build();

        otpRepo.save(otpToken);
        mailService.sendOtp(req.getEmail(), otp);
    }

    public void verifySignupOtp(OtpVerifyRequest req) {
        OtpToken otpToken = otpRepo
                .findTopByEmailAndPurposeAndUsedFalseOrderByIdDesc(req.getEmail(), "SIGNUP")
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (!otpToken.getCode().equals(req.getOtp()))
            throw new RuntimeException("Invalid OTP!");

        if (otpToken.getExpiresAt().isBefore(Instant.now()))
            throw new RuntimeException("OTP expired!");

        otpToken.setUsed(true);
        otpRepo.save(otpToken);

        AppUser user = AppUser.builder()
                .email(req.getEmail())
                .password(otpToken.getEncodedPassword())
                .role(Role.ROLE_USER)
                .enabled(true)
                .build();

        userRepo.save(user);
    }

    // ---- LOGIN ----
    public void login(LoginRequest req) {
        AppUser user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // verify password before sending OTP
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String otp = generateOtp();

        otpRepo.save(OtpToken.builder()
                .email(user.getEmail())
                .code(otp)
                .purpose("LOGIN")
                .expiresAt(Instant.now().plusSeconds(300))
                .used(false)
                .build());

        mailService.sendOtp(user.getEmail(), otp);
    }

    public AuthResponse verifyLoginOtp(OtpVerifyRequest req) {
        OtpToken otpToken = otpRepo
                .findTopByEmailAndPurposeAndUsedFalseOrderByIdDesc(req.getEmail(), "LOGIN")
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (!otpToken.getCode().equals(req.getOtp()))
            throw new RuntimeException("Invalid OTP!");

        if (otpToken.getExpiresAt().isBefore(Instant.now()))
            throw new RuntimeException("OTP expired!");

        otpToken.setUsed(true);
        otpRepo.save(otpToken);

        AppUser user = userRepo.findByEmail(req.getEmail()).orElseThrow();

        // generate JWT and enforce single session
        String token = jwtService.generateToken(user);
        user.setCurrentToken(token);
        user.setTokenIssuedAt(Instant.now());
        userRepo.save(user);

        return new AuthResponse(token, user.getRole().name());
    }
}
