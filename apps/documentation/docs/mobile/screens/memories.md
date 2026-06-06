# Memories Screen

**Route:** `/memories`
**Status:** ✅ Done

## Overview

The Memories screen lets users capture and store special moments with media, metadata, and privacy controls. Memories are stored locally in `SecureStore` under the `memories` key.

## Architecture

```
features/memories/
├── context/MemoriesContext.tsx    ← State management (memories, add/update/delete)
├── hooks/useMemories.ts           ← Public hook wrapping context
├── types/memory.types.ts          ← Memory interface & payload types
├── utils/
│   ├── memoryUtils.ts             ← Date validation, formatting helpers
│   └── memoryService.ts           ← SecureStore persistence layer
├── components/
│   ├── MemoryCard.tsx             ← Memoized grid card with thumbnail + metadata
│   ├── MemoryGrid.tsx             ← 2-column FlatList wrapper
│   ├── MemoryList.tsx             ← Single-column FlatList variant
│   ├── MoodBadge.tsx              ← Feeling icon chip
│   ├── PrivacyBadge.tsx           ← Lock overlay icon
│   ├── MoodSelector.tsx           ← Reusable feeling picker (chips)
│   ├── PrivacySelector.tsx        ← Reusable privacy radio group
│   └── MediaPicker.tsx            ← Gallery/Camera image picker
└── screens/
    ├── MemoriesListScreen.tsx      ← Grid list with empty state
    ├── AddMemoryScreen.tsx         ← 3-step wizard modal
    └── MemoryDetailScreen.tsx      ← Read-only detail view
```

## Data Model

```ts
interface Memory {
  id: string;
  mediaUri: string;       // local file URI
  mediaType: 'image' | 'video';
  title: string;
  description: string;
  date: string;           // YYYY-MM-DD, past dates only
  location: string;       // free-text tags e.g. "Paris"
  feeling: MemoryFeeling | null;
  isPrivate: boolean;     // true = only me, false = shared with partner
  createdAt: string;      // ISO 8601
}
```

## List View (Memories Tab)

| Element | Type | Description |
|---------|------|-------------|
| Title | Text | "Memories" header |
| Add button | Pressable (circular, `+` icon) | Opens Add Memory modal |
| Memory cards | FlatList (2-column grid) | Each card shows image thumbnail, title, date, location, and lock icon if private |
| Empty state | View | Icon + "No memories yet" message when list is empty |

### States

| State | Behavior |
|-------|----------|
| **Loading** | Reads from SecureStore via `MemoriesContext` on mount and screen focus |
| **Empty** | Shows icon + message, add button in header |
| **Has data** | 2-column grid with memory cards |
| **Private card** | Lock icon overlay on thumbnail |
| **Error** | Silent failure (data just won't load) |

---

## Add Memory Modal

**Route:** `/add-memory` (presented as modal)
**Status:** ✅ Done

3-step wizard inside a modal. Step indicator dots at top. Close button (X) dismisses modal.

### Layer 1 — Select Media

| Element | Type | Description |
|---------|------|-------------|
| Title | Text | "Select Media" |
| Subtitle | Text | "Choose a photo or video from this moment" |
| MediaPicker | Component | Gallery + Camera buttons / preview + re-pick |

**States:**

| State | Behavior |
|-------|----------|
| **Default** | Two buttons: Gallery + Camera |
| **Media selected** | Shows image preview, re-pick button, Next enabled |
| **Permission denied** | Toast error: "Camera permission required" |

### Layer 2 — Metadata

| Field | Required | Type | Validation |
|-------|----------|------|------------|
| Title | Yes | TextInput (single-line) | Cannot be empty |
| Description | No | TextInput (multiline) | Free text |
| Date | No (defaults to today) | TextInput (number-pad, YYYY-MM-DD) | Past dates only |
| Location | No | TextInput (single-line) | Free text tags |

### Layer 3 — Feeling & Privacy

| Element | Type | Options |
|---------|------|---------|
| MoodSelector | Chip selector | Happy 😊 / Romantic 💕 / Fun ▶️ / Emotional 💧 (single select) |
| PrivacySelector | Radio group (2 options) | **Private** (lock) — only I can see / **Shared** (people) — partner can see |

---

## Memory Detail Screen

**Status:** 🏗 Placeholder (component exists, no route yet)

Read-only detail view showing memory media, metadata, feeling badge, and privacy badge.

---

## Translations

All string keys under `memories.*` in both `en.ts` and `ar.ts`. See localization files for full list.

## Dependencies

- `expo-image-picker` (already in project)
- `expo-secure-store` (via `lib/utils/secureStorage.ts`)
- `@expo/vector-icons` (Ionicons, already in project)
