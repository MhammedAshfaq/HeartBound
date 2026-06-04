# Login Screen

## Purpose

Entry point for phone-based OTP login and optional social sign-in (mock).

## Implementation

| Item | Value |
|------|--------|
| File | `src/screens/LoginScreen.tsx` |
| UI component | `src/components/auth/LoginForm.tsx` |
| Navigator | `AuthNavigator` → `Login` |
| Header | Hidden |

## Layout

- `SafeAreaView` with `screenLayout.safe`
- Form content uses `screenPadding` (24px) inside `LoginForm`

## UI (LoginForm)

- App logo, title, and subtitle
- Country code picker (modal list of countries)
- Phone number input with validation (`phoneSchema` / react-hook-form)
- **Send OTP** button
- Terms text
- Social divider (“OR”)
- Social buttons: Google, Apple, Facebook (`Ionicons`)

## User actions

| Action | Behavior |
|--------|----------|
| Send OTP | Calls `useAuth().sendOTP(phone)` → navigates to `OTPVerification` with `{ phone }` |
| Social login (mock) | Dispatches `setCredentials` + `setOnboardingComplete(true)` → resets stack to `Quiz` (skips onboarding) |

## Loading state

`Loading` overlay with message *Sending OTP...* while `useAuth().loading` is true.

## Dependencies

- `useAuth` — OTP send
- `authSlice` — credentials for social mock
- `@navigation/AuthNavigator` — typed navigation

## Future enhancements

- Real OAuth SDK integration
- Error toasts for failed OTP send
- Remember last-used country code
