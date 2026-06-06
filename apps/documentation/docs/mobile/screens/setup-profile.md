# Setup Profile Screen

**Route:** `app/(auth)/setup-profile.tsx`
**Status:** ✅ Done (UI + local session update, no backend save)

---

## What This Screen Contains

### Header Section
- **Title:** "Complete your Profile" — simple, clean heading
- **Profile Picture:** Tappable avatar circle with camera icon overlay (optional upload)

### Form Fields

#### About You

| # | Field | Input Type | Behaviour |
|---|-------|------------|-----------|
| 1 | Full Name | Text input | Required, 2-40 characters, prefilled from session when available |
| 2 | Nickname | Text input | Optional |
| 3 | Date of Birth | Masked text input | Required, formatted as `YYYY-MM-DD`, rejects future dates |
| 4 | Email ID | Text input | Optional, email keyboard type |
| 5 | Gender | Selectable chips | Optional, single selection: Male, Female, Non-binary, Prefer not to say |
| 6 | Relationship Status | Selectable chips | Single selection: Single, In a Relationship, Married, Engaged |

#### Partner Details (shown when Relationship Status is not "Single")

| # | Field | Input Type | Behaviour |
|---|-------|------------|-----------|
| 7 | Partner ID | Text input | Optional — link if partner shares the same account |
| 8 | Partner Name | Text input | Optional |
| 9 | Anniversary Date | Masked text input | Optional, formatted as `YYYY-MM-DD` |
| 10 | Partner DOB | Masked text input | Optional, formatted as `YYYY-MM-DD` |
| 11 | Partner Code | Text input | Optional — link if partner has the app with their own account |

### Buttons / Actions

| Element | Type | What Happens on Tap |
|---------|------|---------------------|
| **Save Profile** | Primary button | Validates required fields, updates local user session, routes to Home tab |

### States

| State | What User Sees |
|-------|----------------|
| Default | Profile form with all fields; partner section hidden if single |
| Loading | Save button shows ActivityIndicator and becomes disabled |
| Validation | Inline errors under invalid required fields |
| Success | Session user updates and the app redirects to Home |

### Data Flow

**Local session update:**
```json
{
  "user": {
    "name": "Ayesha Khan",
    "dateOfBirth": "1998-04-25",
    "gender": "female",
    "nickname": "Ayesha",
    "relationshipStatus": "married",
    "partnerId": "",
    "partnerName": "Rahul",
    "anniversaryDate": "2022-12-15",
    "partnerDob": "1995-07-10",
    "partnerCode": ""
  }
}
```

**Navigation:**
`/(auth)/setup-profile` → `/(tabs)`

### Validation
- Full name must be at least 2 characters
- DOB must match `YYYY-MM-DD`
- DOB must be a valid past date
- Gender is optional
- All partner fields are optional (only shown when relationship status is not "Single")
