package com.example.covid19.controller;

import com.example.covid19.dto.*;
import com.example.covid19.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // STEP 1: Signup -> OTP sent
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok("OTP sent to email for verification.");
    }

    // STEP 2: Verify OTP -> Account Created
    @PostMapping("/verify-signup-otp")
    public ResponseEntity<String> verifySignupOtp(@RequestBody OtpVerifyRequest request) {
        authService.verifySignupOtp(request);
        return ResponseEntity.ok("Signup successful, you can now login!");
    }

    // STEP 3: Login -> OTP sent
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        authService.login(request);
        return ResponseEntity.ok("OTP sent to email for login authentication.");
    }

    // STEP 4: Verify Login OTP -> JWT Returned
    @PostMapping("/verify-login-otp")
    public ResponseEntity<AuthResponse> verifyLoginOtp(@RequestBody OtpVerifyRequest request) {
        AuthResponse response = authService.verifyLoginOtp(request);
        return ResponseEntity.ok(response);
    }
}
