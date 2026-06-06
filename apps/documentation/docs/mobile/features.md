# Features & Capabilities

Audience: Senior Management, Tech Lead, Release Manager

---

## Screens (Detailed Breakdown)

Each screen has its own document with exact fields, buttons, data flows, and states:

| Screen | Document | Status |
|--------|----------|--------|
| Login (phone + OTP + social) | [screens/login.md](/mobile/screens/login) | ✅ |
| OTP Verification (6-digit) | [screens/otp-verification.md](/mobile/screens/otp-verification) | ✅ |
| Setup Profile (name, DOB, gender, nickname, email, relationship status, partner details, profile picture) | [screens/setup-profile.md](/mobile/screens/setup-profile) | ✅ |
| Home Dashboard | [screens/home.md](/mobile/screens/home) | 🏗 |
| Memories (grid + 3-step add wizard + detail) | [screens/memories.md](/mobile/screens/memories) | ✅ |
| Notification | [screens/notification.md](/mobile/screens/notification) | ✅ |
| Profile (rich: header, snapshot, moments, insights, achievements, settings, appearance, notifications) | [screens/profile.md](/mobile/screens/profile) | ✅ |
| Games | [screens/games.md](/mobile/screens/games) | 🏗 |
| Action | [screens/action.md](/mobile/screens/action) | 🏗 |

---

## App Infrastructure

### Session Management
- Tokens stored in `expo-secure-store` (iOS Keychain / Android Keystore)
- Auto-restored on app launch

### API Layer
- Axios client with Bearer token injection
- Auto-refresh on 401 via `/v1/auth/refresh`
- Two clients: public (`client`) and authenticated (`authClient`)

### Authentication
- Phone number login with OTP
- OAuth stubs for Google, Apple, Facebook (context ready, UI planned)
- OTP verification for 2FA
- Post-login profile setup for essential details before entering tabs
- Logout with session cleanup

### Theme
- Light, Dark, System modes
- 14 semantic color tokens per mode
- Navigation bar, tab bar, and all screens adapt

### Internationalization
- English and Arabic
- Auto-detects device locale
- Runtime switching
- RTL ready for Arabic

### Data Fetching
- `@tanstack/react-query` with 2 retries, 5-min stale time
- Centralised cache layer

### Notifications
- Toast system (success, error, info) via `burnt` library

---

## Status Summary

| Status | Count | Items |
|--------|-------|-------|
| ✅ Done | 13 | Login, OTP, Setup Profile, Profile (rich), Memories (grid + 3-step add + detail), Notification, Session, API, Auth, Theme, i18n, React Query, Toast |
| 🏗 Placeholder | 4 | Home mood check-in, Action, Games, Analytics |
| 📋 Planned | 3 | Settings, Invite Partner, Charts |
