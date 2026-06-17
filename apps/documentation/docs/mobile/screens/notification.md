# Notification Screen

**Route:** `app/(tabs)/notification.tsx`
**Status:** ✅ Done

## Overview

The Notification Screen lists all relationship updates, streak milestones, anniversary alerts, and partner activities. It displays unread badges, custom category icons, and lets the user mark individual items or the entire list as read.

## UI Layout & Components

```
┌──────────────────────────────────────────────┐
│  Notifications [ 3 ]        Mark all as read │  ← Header: title + count badge
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ (♥) New memory added               ●   │  ← Unread state: active indicator dot
│  │     Your partner added a new memory    │  │
│  │     2m ago                             │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ (🏆) Achievement unlocked               │  │  ← Read state: dimmed background, no dot
│  │     You earned the "Communication Pro" │  │
│  │     1d ago                             │  │
│  └────────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘
```

### 1. Title Header Row
- **Title:** "Notifications" (`tabs.notification` translation key).
- **Unread Count Badge:** Colored badge showing the count of unread items (e.g., `3`). Only visible when count > 0.
- **Mark All Read:** Interactive action button shown on the top-right when at least one unread notification exists.

### 2. Notifications Scroll View
- **Notification Cards:** Custom pressable cards containing:
  - **Category Icon:** Specific symbol and accent color based on context:
    - Pink Heart `heart`: New memories added.
    - Blue Chat `chatbubble-ellipses`: Daily question readiness.
    - Yellow Star `star`: Streak milestones.
    - Purple Calendar `calendar`: Anniversary countdowns.
    - Orange Trophy `trophy`: Earned achievements.
    - Green bell `notifications`: Partner check-ins.
    - Yellow Bulb `bulb`: Fresh kindness ideas.
  - **Text Copy:** Displays title, detailed description, and localized time labels (e.g., "5m ago").
  - **Read State:** Unread items show a highlighted background color and a circular unread status dot, which hide automatically once clicked.

### 3. Empty State
- Displays a themed alert symbol and message "No notifications yet" when state contains no notification objects.

---

## Technical Details

### State Management
- Initialized with 7 local seed notifications in state.
- **`markAsRead(id)`**: Map function updating `read: true` for the chosen item ID.
- **`markAllRead()`**: Map function updating `read: true` for all notification objects.

---

## Translation Keys

Translation keys are located in `localization/en.ts` and `ar.ts` under:
- `tabs.notification`
- `notification.markAllRead`
- `notification.empty`
