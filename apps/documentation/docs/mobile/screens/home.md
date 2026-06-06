# Home Screen (Dashboard)

**Route:** `app/(tabs)/index.tsx`
**Status:** 🏗 Placeholder (UI built, no API wiring)

---

## What This Screen Contains

### Greeting Section
- **Text:** "Welcome back, {user.name}!" — 24px bold
- **Source:** `user.name` from authenticated session

### Mood Check-in Card

An elevated rounded card containing a modern mood selector and a note composer:

| Element | Type | Details |
|---------|------|---------|
| Question | Label | "How are you feeling?" — 16px semibold |
| Mood options | Selectable tiles | Emoji badge, mood label, selected state highlight |
| Quick note | Text input | Multiline note field shown at all times |
| Submit button | Primary button | Submits the mood + note check-in |
| Saved state | Banner | Brief success feedback after save |

- Mood tiles are displayed in a compact grid for a more modern look
- The input and save action remain visible, even before a mood is selected
- Currently no API call on save (UI only)

### Recent Memories Card

A white rounded card containing:

| Element | Type | Details |
|---------|------|---------|
| Title | Label | "Recent Memories" — 16px semibold |
| Content | Placeholder text | "No memories yet. Add your first memory!" — grey, centered |

### States

| State | What User Sees |
|-------|----------------|
| Default | Greeting + Mood card + Memories card (empty) |
| Mood selected | Tile highlight updates and composer shows the chosen mood |
| Saved | Success banner appears and note input resets |
| Has memories | Memory cards appear (not yet implemented) |

### Stat Colors

The two top stat cards use calm semantic colors instead of red, so they read as status indicators rather than danger states:

| Card | Accent color intent |
|------|---------------------|
| Relationship Score | Blue / trust-oriented accent |
| Day Streak | Green / success-oriented accent |

### Planned Enhancements
- Wire mood selection to `POST /v1/mood`
- Fetch recent memories from API
- Add "View All" link
- Add partner activity summary
