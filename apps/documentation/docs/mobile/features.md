# Features & Capabilities

Audience: Senior Management, Tech Lead, Release Manager

---

## Screens (Detailed Breakdown)

Each screen has its own document with exact fields, buttons, data flows, and states:

| Screen | Document | Status |
|--------|----------|--------|
| Login (phone + social login) | [screens/login.md](/mobile/screens/login) | ✅ Done |
| OTP Verification (6-digit) | [screens/otp-verification.md](/mobile/screens/otp-verification) | ✅ Done |
| Setup Profile (name, DOB, anniversary date, partner name/email, avatar) | [screens/setup-profile.md](/mobile/screens/setup-profile) | ✅ Done |
| Relationship Questions (5-step animated card wizard) | [screens/relationship-questions.md](/mobile/screens/relationship-questions) | ✅ Done |
| Home Dashboard (greeting slider, stat cards, quick actions, mood check-in + note composer, upcoming list) | [screens/home.md](/mobile/screens/home) | ✅ Done |
| Memories (gallery day-grouped, 4-column grid, Day details, Edit Memory, details modal with pinch zoom) | [screens/memories.md](/mobile/screens/memories) | ✅ Done |
| Notification (notifications list with mark-all-read and unread indicators) | [screens/notification.md](/mobile/screens/notification) | ✅ Done |
| Profile (header, snapshot, moments, insights, achievements, settings cards: sync partner, relationship, notifications, appearance/privacy, edit profile, email verification) | [screens/profile.md](/mobile/screens/profile) | ✅ Done |
| Games (game activities placeholder) | [screens/games.md](/mobile/screens/games) | 🏗 Placeholder |
| Action (ideas suggestions list, completed gestures list, add custom actions modal, refresh controls) | [screens/action.md](/mobile/screens/action) | ✅ Done |

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
- Partner Sync option during setup profile or later in Settings Card
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
| ✅ Done | 17 | Login, OTP, Setup Profile, Relationship Questions, Home Dashboard, Memories (gallery + day details + detail modal + edit memory), Notification, Action (suggestions + custom actions), Profile (header, snapshot, achievements, settings: sync, relationship, privacy), Session, API, Auth, Theme, i18n, React Query, Toast, Partner Sync |
| 🏗 Placeholder | 2 | Games, Analytics |
| 📋 Planned | 2 | Settings (advanced sub-screens), Charts |
