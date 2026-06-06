# Profile Screen

**Route:** `app/(tabs)/profile.tsx`
**Status:** ✅ Done (rich)

## Architecture

```
features/profile/
├── screens/
│   └── ProfileScreen.tsx          ← Composes all sections
├── components/
│   ├── ProfileHeader.tsx          ← Avatar, name, partner, together-since, stats row
│   ├── RelationshipSnapshot.tsx   ← Horizontal scroll: Score, Total Actions, Latest Mood
│   ├── FavoriteMoments.tsx        ← Horizontal scroll from MOCK_MEMORIES
│   ├── ActivityInsights.tsx       ← Actions completed, most active category, consistency
│   ├── AIInsightsCard.tsx         ← Purple-tinted personalized insights
│   ├── AchievementsGrid.tsx       ← 3-column grid (3 earned, 3 locked)
│   ├── SettingsCard.tsx           ← Account, Relationship, Notifications, Privacy stubs
│   ├── AppearanceSelector.tsx     ← Light/Dark radio toggle
│   ├── NotificationToggle.tsx     ← Push toggle (local state only)
│   └── LogoutButton.tsx           ← Destructive button with confirmation alert
└── types/
    └── profile.types.ts           ← MemoryItem, Achievement, ProfileStats, mock data
```

## Sections

| Section | Component | Data Source |
|---------|-----------|-------------|
| Header | ProfileHeader | `useAuth().user` (name, partnerName, anniversaryDate) + mock stats |
| Relationship Snapshot | RelationshipSnapshot | Mock stats + `MOCK_MOOD_HISTORY` |
| Favorite Moments | FavoriteMoments | `MOCK_MEMORIES` (5 items, 4 favorites) |
| Activity Insights | ActivityInsights | Mock stats + `MOCK_ACTIONS` |
| AI Insights | AIInsightsCard | Mock stats |
| Achievements | AchievementsGrid | `ACHIEVEMENTS` (6 items, 3 earned) |
| Settings | SettingsCard | All rows show "Coming Soon" alert |
| Appearance | AppearanceSelector | `useTheme().setMode()` |
| Notifications | NotificationToggle | Local `useState` (not persisted) |
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

## Sub-screens (Planned)

| Screen | Purpose | Status |
|--------|---------|--------|
| Account | Edit name, avatar, email, phone | 📋 Planned |
| Relationship | Partner connection details | 📋 Planned |
| Notifications | Notification preferences | 📋 Planned |
| Privacy | Privacy controls | 📋 Planned |
