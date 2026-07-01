# Profile Screen

**Route:** `app/(tabs)/profile.tsx`
**Status:** ✅ Done (rich)

## Architecture

```
features/profile/
├── screens/
│   └── ProfileScreen.tsx          ← Composes all sections
├── components/
│   ├── ProfileHeader.tsx          ← Cover image + floating card (avatar, name, status, stats, actions)
│   ├── AccountDetailsCard.tsx     ← Email, phone, DOB, country, relationship status
│   ├── PartnerDetailsCard.tsx     ← Partner name, DOB, email, anniversary
│   ├── ProfileDetailRow.tsx       ← Shared aligned detail row with icon + divider
│   ├── RelationshipSnapshot.tsx   ← Horizontal scroll: Score, Total Actions, Latest Mood
│   ├── FavoriteMoments.tsx        ← Horizontal scroll from MOCK_MEMORIES
│   ├── ActivityInsights.tsx       ← Actions completed, most active category, consistency
│   ├── AIInsightsCard.tsx         ← Purple-tinted personalized insights
│   ├── AchievementsGrid.tsx       ← 3-column grid (3 earned, 3 locked)
│   ├── SettingsCard.tsx           ← Account (navigates), Sync Partner/Relationship/Notifications/Privacy (expandable inline)
│   ├── DatePickerModal.tsx        ← Modal with react-native-calendar-picker (year/month dropdown, themed)
│   └── LogoutButton.tsx           ← Destructive button with confirmation alert
└── types/
    └── profile.types.ts           ← MemoryItem, Achievement, ProfileStats, mock data
```

## Sections

| Section | Component | Data Source |
|---------|-----------|-------------|
| Header | ProfileHeader | Cover image + floating card: small avatar, name + verified badge, relationship status, streak/score/days stats, Edit + Share buttons |
| Relationship Snapshot | RelationshipSnapshot | Mock stats + `MOCK_MOOD_HISTORY` |
| Favorite Moments | FavoriteMoments | `MOCK_MEMORIES` (5 items, 4 favorites) |
| Activity Insights | ActivityInsights | Mock stats + `MOCK_ACTIONS` |
| AI Insights | AIInsightsCard | Mock stats |
| Achievements | AchievementsGrid | `ACHIEVEMENTS` (6 items, 3 earned) |
| Settings | SettingsCard | Account → email-verification screen. Sync Partner (dropdown: TextInput + Sync + Unsync buttons with confirmation Alerts), Relationship (chips with Alert.confirm), Notifications (toggle), Privacy (Light/Dark) — all expandable inline within the card |
| Logout | LogoutButton | `useAuth().logout()` → `router.replace('/(auth)')` |

## States

| State | Behavior |
|-------|----------|
| Logged in | Full profile with all sections |
| No name | Shows "User" in header |
| No partner | Shows italic "Connect with your partner" |
| No anniversary | Hides together-since row |
| No mood history | Latest Mood shows "--" |
| Dark mode | All sections adapt via `useTheme()` |
| Logging out | Button shows "Logging out..." with confirmation alert |

## Data Sources

| Data | Source | Notes |
|------|--------|-------|
| User name/email | `useAuth().user` | Real |
| Partner name | `useAuth().user.partnerName` | Real |
| Anniversary | `useAuth().user.anniversaryDate` | Real |
| Theme mode | `useTheme().isDark` + `setMode()` | Real |
| Stats (completed, total, streak) | Local `STATS` constant | Mock |
| Mood history | `MOCK_MOOD_HISTORY` (5 entries) | Mock |
| Favorite memories | `MOCK_MEMORIES` (5 items) | Mock |
| Action history | `MOCK_ACTIONS` (5 items) | Mock |
| Achievements | `ACHIEVEMENTS` (6 items) | Mock |

## Sub-screens & Modals

| Screen | Route | Purpose | Status |
|--------|-------|---------|--------|
| **Edit Profile** | `/(modals)/edit-profile` | Form editing for user/partner details & profile photo | ✅ Done |
| **Email Verification** | `/(modals)/email-verification` | OTP validation wizard for email updates | ✅ Done |
| **AI Insights** | `/(modals)/ai-insights` | Animated screen displaying personalized relationship tips | ✅ Done |
| **Relationship Status** | `/(modals)/relationship-status` | Toggle relationship state selection list | ✅ Done |

---

### 1. Edit Profile Screen

**File:** `features/profile/screens/EditProfileScreen.tsx`

Allows editing the user's own profile parameters, uploading a profile avatar, and updating partner connectivity fields.

- **Avatar Selection:** Pressing the avatar opens a custom photo actions modal allowing Camera input or Gallery library selection. Crops images to a 1:1 square. Requires media permission grants first.
- **Form Formats:**
  - Full Name: String field; validates that inputs are at least 2 characters.
  - Date of Birth: Launches a calendar datepicker modal.
  - Anniversary Date: Launches a calendar datepicker modal.
  - Partner Details: Configures Partner Name, Partner Date of Birth, and Partner Email.
- **Save Actions:** Commits changes through `updateProfile` and returns back, showing a success toast. Disables the save button if no fields differ from initial state.

#### API Integration

| Operation | Method | Endpoint | Auth |
|-----------|--------|----------|------|
| Update user profile | `PATCH` | `/v1/users/:userId` | Bearer token (authClient) |

**Payload fields:**

```json
{
  "email": "",
  "name": "",
  "dateOfBirth": "",
  "gender": "",
  "relationshipStatus": "",
  "partnerId": null,
  "partnerName": null,
  "anniversaryDate": null,
  "partnerDob": null,
  "partnerEmail": null,
  "partnerCode": null
}
```

- `userId` is taken from `session.user.id` stored in `SessionContext` after OTP verification.
- The Bearer token is automatically injected by `authClient` from `ApiContext`.
- On success, the updated user object from the API response is merged back into `SessionContext` and persisted to `SecureStore`.

---

### 2. Email Verification Screen

**File:** `features/profile/screens/EmailVerificationScreen.tsx`

A verification screen utilized when updating the user account email address:

- **Flow Phase 1 (Enter Email):** Checks format validation (e.g. contains `@` and `.`). Pressing "Send OTP" shows a loading indicator and triggers verification code delivery.
- **Flow Phase 2 (Enter OTP):** Displays a 6-digit verification code row. Focus advances to the next digit input box automatically.
  - **Master Bypass Code:** `987654`
  - **Resend Counter:** 60-second resend cooldown timer.
- **Success Outcome:** Correct code updates the profile details in memory and returns to the previous screen.

---

### 3. AI Insights Screen

**File:** `features/profile/screens/AIInsightsScreen.tsx`

Displays customized feedback based on user engagement metrics:

- **Processing State:** Simulates profile processing for 1.5 seconds on screen entrance. Features a sparkles badge and three purple dots translating up and down in a parallel bouncing animation loop.
- **Render Layout:** Lists the active user's insights array (retrieved from `useAuth().user.insights`) with custom icons (e.g. key, heart, chat) and themed cards highlighting connectivity tips.

---

### 4. Relationship Status Screen

**File:** `features/profile/screens/RelationshipStatusScreen.tsx`

An isolated modal to adjust the user's relationship status settings.

- **Options:** Grid of selectable status option chips: Single, In Relationship, Married, Engaged.
- **Validation Dialogue:** Selecting a new status and pressing "Update Status" triggers a standard React Native confirm/cancel dialogue box (`Alert.alert`). Confirmed updates submit changes, fire a toast message, and close the screen.

