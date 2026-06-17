# Home Screen (Dashboard)

**Route:** `app/(tabs)/index.tsx`
**Status:** ✅ Done (UI & Components complete)

## Overview

The Home Dashboard is the main entry point of the app tab interface. It provides an immediate greeting, high-level relationship stats, shortcuts to key features, a daily mood check-in composer, and a listing of upcoming calendar events.

## UI Layout & Components

```
┌──────────────────────────────────────────────┐
│  Good Morning!                       [Avatar]│  ← Header: Greeting + message slider + profile avatar
│  Small actions build strong...               │
├──────────────────────────────────────────────┤
│  ┌────────────────────┐ ┌──────────────────┐ │
│  │ Relationship Score │ │ Day Streak       │ │  ← Stats Row: 2 column cards
│  │ 75%                │ │ 5                │ │
│  │ Strong connection  │ │ Keep it going!   │ │
│  └────────────────────┘ └──────────────────┘ │
├──────────────────────────────────────────────┤
│  Quick Actions                               │
│  [■ Action] [♥ Memory] [🔔 Notif] [● Profile]│  ← Horizontal scrollable action buttons
├──────────────────────────────────────────────┤
│  How are you feeling?                        │
│  [😊] [🤩] [😐] [😰] [😢] [😡]                │  ← Mood Selector grid
│  Note: [ Write a note...                   ] │  ← Note composer
│  [ Submit Check-in ]                         │
├──────────────────────────────────────────────┤
│  Upcoming                                    │
│  📞 Call your partner (Today 8 PM)           │  ← Upcoming events list
│  🎉 Anniversary (June 10 ❤️)                  │
└──────────────────────────────────────────────┘
```

### 1. Header Row
- **Dynamic Greeting:** Title text (e.g. "Good Morning!") alongside a shifting message banner showing love-affirming reminders (e.g., "Love is in the little things 🌸"). The message cycles every 6 seconds with a fade animation.
- **Profile Avatar:** Circular photo displaying the logged-in user's avatar.

### 2. Stats Cards Row
Two side-by-side metric status panels displaying:
- **Relationship Score:** Shows current calculated connectivity (e.g. `75%`), status label, and blue accent indicator (`#2563eb`).
- **Day Streak:** Shows active daily engagement streak (e.g. `5` days), completion indicator text (e.g., "Completed today ✅" or "Keep it going!"), and green accent indicator (`#16a34a`).

### 3. Quick Actions
A grid of 4 pressable shortcuts with custom icons, color backdrops, and click-down scaling (0.95 scale) animations:
- **Action:** Navigates to the Kindness Action tab.
- **Memory:** Navigates to the Memories Gallery tab.
- **Notification:** Navigates to the Notification tab.
- **Profile:** Navigates to the Profile settings tab.

### 4. Mood Check-in Card (`MoodSelector`)
- **Mood Tiles:** 6 selectable emoji mood buttons:
  - Happy 😊 (Green `#22C55E`)
  - Excited 🤩 (Orange `#F97316`)
  - Neutral 😐 (Slate `#64748B`)
  - Stressed 😰 (Red `#EF4444`)
  - Sad 😢 (Blue `#3B82F6`)
  - Angry 😡 (Pink `#EC4899`)
- **Note Input:** Multiline text editor for writing notes.
- **Submit Button:** Commits the check-in, resets the text input, and triggers a brief check-in success banner.

### 5. Upcoming List (`UpcomingList`)
- Lists immediate anniversary events and actions:
  - Call partner: "Today 8 PM"
  - Anniversary: "June 10 ❤️"
- **Empty State:** Shows a light bulb indicator and text "No upcoming plans — plan something special" if no events are listed.

---

## Technical Details

### Animation Sequences
- **Message Banner:** Uses `Animated.sequence` of a fast `fadeAnim` opacity reduction (`200ms`) and slow recovery (`400ms`) during greeting updates.
- **Quick Action Buttons:** Uses `Animated.timing` for parallel slide-up and fade-in entry on component load. Press down states are animated via a transform scale factor reduction.

---

## Translation Keys

Translation keys located in `localization/en.ts` and `ar.ts`:
- `home.moodQuestion`
- `home.moodSubtitle`
- `home.noteLabel`
- `home.notePlaceholder`
- `home.submit`
- Mood keys: `home.moods.happy`, `home.moods.excited`, `home.moods.neutral`, `home.moods.stressed`, `home.moods.sad`, `home.moods.angry`
