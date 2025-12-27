# TODO: Fix Dashboard Forbidden Error

## Completed Tasks
- [x] Analyze the issue: JWT tokens expire after 15 minutes, causing 403 Forbidden on API calls
- [x] Modify ApiService to inject AuthService
- [x] Add catchError to all HTTP methods in ApiService
- [x] Implement handleError method to logout on 403 errors

## Followup Steps
- [ ] Test the fix by logging in and waiting for token to expire
- [ ] Verify that on API call after expiry, user is redirected to login
- [ ] Ensure no other 403 scenarios are broken
