# Login Screen

**Route:** `app/(auth)/index.tsx`
**Status:** ✅ Done (phone + OTP + social login)

---

## What This Screen Contains

### Header Section
- **Logo:** Heart icon (`Ionicons heart`) in a rounded circle with primary-tint background
- **App title:** "HeartBond" — 28px bold, primary color
- **Subtitle:** "Nurture your bond every day" — grey, 15px

### Form Fields

| # | Field | Input Type | Behaviour |
|---|-------|------------|-----------|
| 1 | Country picker | Touchable row (flag + dial code + chevron) | Opens bottom sheet modal with FlatList of 32 countries |
| 2 | Phone number | Text input with phone-pad keyboard | Validated as 8–15 digits |

- The country picker and phone input share the same control height for a cleaner aligned row

### Country Picker Modal
- **Trigger:** Tap the country picker button (shows flag + dial code)
- **Content:** FlatList of 32 countries with flag, name, dial code
- **Selected state:** Highlighted row + checkmark icon
- **Close:** Tap overlay or close button

### Buttons / Actions

| Element | Type | What Happens on Tap |
|---------|------|---------------------|
| **Send OTP** | Solid rose-red primary button | Validates phone → calls `sendOTP(phone)` → navigates to OTP screen |
| **Continue with Google** | Circular icon button | Calls `loginWithOAuth('google', token)` |
| **Continue with Apple** | Circular icon button | Calls `loginWithOAuth('apple', token)` |
| **Continue with Facebook** | Circular icon button | Calls `loginWithOAuth('facebook', token)` |

### Other UI Elements
- **Terms text:** "By continuing, you agree to our Terms of Service and Privacy Policy" — 12px grey
- **Divider:** Horizontal line — "or" — horizontal line
- **Social row:** 3 circular icon buttons (Google red, Apple black, Facebook blue)

### Data Flow

**Step 1 — Send OTP:**
```json
POST /v1/auth/send-otp
{ "phone": "+919876543210" }
```
Response: `{ "success": true }`

**Step 2 — Verify OTP (on OTP screen)**
```json
POST /v1/auth/verify-otp
{ "phone": "+919876543210", "otp": "987654" }
```

**Step 3 — Login Response:**
```json
{
  "accessToken": "jwt...",
  "refreshToken": "jwt...",
  "user": { "id": "uuid", "email": "...", "name": "...", "avatar": "..." }
}
```

### States

| State | What User Sees |
|-------|----------------|
| Loading | Button shows ActivityIndicator (disabled) |
| Success (Send OTP) | Navigate to OTP Verification screen |
| Success (After OTP) | Redirect to Setup Profile screen |
| Error | Toast notification with error message |
| Validation | Inline error under phone input |
