# OTP Verification Screen

## Purpose

Verify the 6-digit OTP sent to the user’s phone and branch new vs returning users into onboarding or the quiz.

## Implementation

| Item | Value |
|------|--------|
| File | `src/screens/OTPVerificationScreen.tsx` |
| Component | `src/components/auth/OTPInput.tsx` |
| Navigator | `AuthNavigator` → `OTPVerification` |
| Route params | `{ phone: string }` |
| Header | Shown — title **Verify OTP** |

## Layout

- `SafeAreaView` with `edges={['bottom']}` (header handles top safe area)
- `screenLayout.staticContent` + centered content
- Standard `screenPadding` (24px)

## UI

- Mail icon in circular primary-light container
- Title and subtitle showing masked phone number
- Dev hint: *Use code: 987654* (mock OTP)
- Six-digit OTP input with auto-advance
- Resend OTP control
- `Loading` overlay — *Verifying...*

## User actions

| Action | Behavior |
|--------|----------|
| Submit OTP | `loginWithOTP(phone, otp)` |
| New user (`response.isNewUser`) | `navigation.replace('Onboarding')` |
| Returning user | Reset to `Quiz` at app root |
| Resend | `sendOTP(phone)` again |

## Dependencies

- `useAuth` — `loginWithOTP`, `sendOTP`
- `AuthStackParamList` — route typing

## Future enhancements

- Remove dev seed hint in production builds
- Countdown timer before resend is enabled
- SMS auto-read (platform-specific)
