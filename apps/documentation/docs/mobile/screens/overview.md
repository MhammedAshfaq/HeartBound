# Screens Overview

All screens in the mobile app, organised by navigation group.

---

## Auth Screens

| Screen | File | Status | Description |
|--------|------|--------|-------------|
| [Onboarding](/mobile/screens/onboarding) | `app/(auth)/index.tsx` | ✅ Done | Intro & value propositions for new users |
| [Login](/mobile/screens/login) | `app/(auth)/login.tsx` | ✅ Done | Phone + OTP login, social login |
| [OTP Verification](/mobile/screens/otp-verification) | `app/(auth)/otp-verification.tsx` | ✅ Done | 6-digit code verification |
| [Setup Profile](/mobile/screens/setup-profile) | `app/(auth)/setup-profile.tsx` | ✅ Done | Basic profile details captured after login |
| [Relationship Questions](/mobile/screens/relationship-questions) | `app/(auth)/relationship-questions.tsx` | ✅ Done | Modern 5-step animated MCQ card wizard |

## Tab Screens

| Screen | File | Status | Description |
|--------|------|--------|-------------|
| [Home](/mobile/screens/home) | `app/(tabs)/index.tsx` | ✅ Done | Dashboard with stats, quick actions, mood check-in and upcoming list |
| [Action](/mobile/screens/action) | `app/(tabs)/action.tsx` | ✅ Done | Relationship suggestion ideas and kindness logger |
| [Memories](/mobile/screens/memories) | `app/(tabs)/memories.tsx` | ✅ Done | Memory gallery with 3-layer add wizard |
| [Games](/mobile/screens/games) | `app/(tabs)/games.tsx` | 🏗 Placeholder | Games and activities |
| [Notification](/mobile/screens/notification) | `app/(tabs)/notification.tsx` | ✅ Done | Notification list with mark-as-read |
| [Profile](/mobile/screens/profile) | `app/(tabs)/profile.tsx` | ✅ Done | User info, settings menu, logout |

## Modal Screens

| Screen | File | Status | Description |
|--------|------|--------|-------------|
| [Add Memory](/mobile/screens/memories#add-memory-modal) | `app/(modals)/add-memory.tsx` | ✅ Done | 3-step wizard: media → metadata → feeling & privacy |
| [Edit Memory](/mobile/screens/memories#edit-memory-modal) | `app/(modals)/edit-memory.tsx` | ✅ Done | Form to edit memory metadata (title, description, etc.) |
| [Day Memories](/mobile/screens/memories#day-memories-screen-pushed) | `app/(modals)/day-memories.tsx` | ✅ Done | Grid layout displaying all memories for a chosen date |
| [Memory Detail](/mobile/screens/memories#memory-detail-screen-modal) | `app/(modals)/memory-detail.tsx` | ✅ Done | Zoomable memory photo viewer with location and feeling chips |
| [Edit Profile](/mobile/screens/profile#edit-profile) | `app/(modals)/edit-profile.tsx` | ✅ Done | Update full name, DOB, anniversary date, partner info, and avatar |
| [Email Verification](/mobile/screens/profile#email-verification) | `app/(modals)/email-verification.tsx` | ✅ Done | Verify new email via 6-digit OTP code |
| [AI Insights](/mobile/screens/profile#ai-insights) | `app/(modals)/ai-insights.tsx` | ✅ Done | Personalized relationship suggestions with loading animation |
| [Relationship Status](/mobile/screens/profile#relationship-status) | `app/(modals)/relationship-status.tsx` | ✅ Done | Inline relationship status selector modal |
| (Container) | `app/(modals)/_layout.tsx` | ✅ Done | Modal stack layout |

---

Status: ✅ Done | 🏗 Placeholder | 📋 Planned
