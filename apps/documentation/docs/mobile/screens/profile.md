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

## Sub-screens

| Screen | Purpose | Status |
|--------|---------|--------|
| Account (email update) | Change email with OTP verification | ✅ Done |
| AI Insights | Full-screen scrollable insights with processing animation | ✅ Done |
| Notifications | Inline in SettingsCard (expandable) | ✅ Done |
| Privacy/Appearance | Inline in SettingsCard (expandable) | ✅ Done |
| Relationship | Inline in SettingsCard (expandable chip selector + Alert) | ✅ Done |
| Sync Partner | Inline in SettingsCard (expandable TextInput + Sync / Unsync alerts) | ✅ Done |
