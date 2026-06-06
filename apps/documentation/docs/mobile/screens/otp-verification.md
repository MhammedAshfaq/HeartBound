# OTP Verification Screen

**Route:** `app/(auth)/otp-verification.tsx`
**Status:** ✅ Done

---

## What This Screen Contains

### Header Section
- **Icon:** Envelope emoji in a rounded circle with primary-tint background
- **Title:** "Verify OTP" — 28px bold, dark text
- **Subtitle:** "Enter the 6-digit code sent to {phone}" — grey, centered, phone in primary color bold
- **Seed hint (dev):** "Use code: 987654" — italic grey, for development/testing

### Form Fields

| # | Field | Input Type | Behaviour |
|---|-------|------------|-----------|
| 1–6 | Digit 1–6 | Single-char text input ×6 | Auto-focuses next field when typed |
|     |         |              | Backspace on empty field goes to previous |
|     |         |              | Auto-submits when all 6 digits entered |

- All fields: `maxLength=1`, numeric keyboard, 50×60px boxes with 2px border

### Resend Timer

| State | What User Sees |
|-------|----------------|
| Timer active | "Resend in 45s" — grey, 14px |
| Timer expired | "Resend OTP" — primary color, 16px bold, tappable |

- Initial timeout: 60 seconds
- Resend resets the timer and clears OTP inputs

### Buttons / Actions

| Element | Type | What Happens on Tap |
|---------|------|---------------------|
| Auto-submit | Automatic | When all 6 digits entered, calls `verifyOTP(phone, otp)` |
| **Resend OTP** | Text button (after timer) | Calls `sendOTP(phone)` again, resets timer |
| Back navigation | Header back button | Returns to login screen |

### Data Flow

**Sent to backend:**
```json
POST /v1/auth/verify-otp
{ "phone": "+919876543210", "otp": "987654" }
```

**Received from backend:** Same login response (access + refresh tokens + user)

### States

| State | What User Sees |
|-------|----------------|
| Loading | Loading overlay with "Verifying..." |
| Success | Redirect to Setup Profile screen |
| Error | Toast notification with error message |
| Resend | Timer resets, inputs cleared, first input focused |

### Validation
- Only numeric input allowed via `keyboardType="number-pad"`
- Each field accepts exactly 1 digit
- 6 digits required for submission
