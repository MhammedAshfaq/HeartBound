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
| Relationship Questions | `app/(auth)/relationship-questions.tsx` | ✅ Done | Modern 5-step animated MCQ card wizard |

## Tab Screens

| Screen | File | Status | Description |
|--------|------|--------|-------------|
| [Home](/mobile/screens/home) | `app/(tabs)/index.tsx` | 🏗 Placeholder | Dashboard with mood check-in + recent memories |
| [Action](/mobile/screens/action) | `app/(tabs)/action.tsx` | 🏗 Placeholder | Quick action items |
| [Memories](/mobile/screens/memories) | `app/(tabs)/memories.tsx` | ✅ Done | Memory gallery with 3-layer add wizard |
| [Games](/mobile/screens/games) | `app/(tabs)/games.tsx` | 🏗 Placeholder | Games and activities |
| [Notification](/mobile/screens/notification) | `app/(tabs)/notification.tsx` | ✅ Done | Notification list with mark-as-read |
| [Profile](/mobile/screens/profile) | `app/(tabs)/profile.tsx` | ✅ Done | User info, settings menu, logout |

## Modal Screens

| Screen | File | Status | Description |
|--------|------|--------|-------------|
| [Add Memory](/mobile/screens/memories) | `app/(modals)/add-memory.tsx` | ✅ Done | 3-step wizard: media → metadata → feeling & privacy |
| (Container) | `app/(modals)/_layout.tsx` | ✅ Done | Modal stack layout |

---

Status: ✅ Done | 🏗 Placeholder | 📋 Planned
