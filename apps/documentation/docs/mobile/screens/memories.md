# Memories Screen

**Route:** `/memories`
**Status:** ✅ Done

## Overview

The Memories screen uses a **gallery-style layout** — memories are grouped by day with 4 square thumbnails per row. Each row shows a date header, up to 4 thumbnails, and a "+N More" overlay when a day has more than 4 entries. Tapping any thumbnail opens the detail modal. Tapping "+N More" pushes a day-detail screen showing all memories for that date.

All data is stored locally in `SecureStore` under the `memories` key. If no data exists, 20 seed memories are provided as a fallback.

## Architecture

```
features/memories/
├── data/seed.ts                    ← 20 seed memories for fresh installs
├── context/MemoriesContext.tsx     ← State management + seed fallback
├── hooks/useMemories.ts           ← Public hook wrapping context
├── types/memory.types.ts          ← Memory interface & payload types
├── utils/
│   ├── memoryUtils.ts             ← Date validation, formatting helpers
│   └── memoryService.ts           ← SecureStore persistence layer
├── components/
│   ├── MemoryGalleryRow.tsx        ← Day header + 4-thumbnail row with "+N" overlay
│   ├── MemoryCard.tsx              ← Memoized card (kept for AddMemoryScreen)
│   ├── PrivacyBadge.tsx            ← Lock overlay icon
│   ├── MoodSelector.tsx           ← Reusable feeling picker (chips)
│   ├── PrivacySelector.tsx        ← Reusable privacy radio group
│   └── MediaPicker.tsx            ← Gallery/Camera image picker
└── screens/
    ├── MemoriesListScreen.tsx      ← Groups by date, renders gallery rows
    ├── AddMemoryScreen.tsx         ← 3-step wizard modal (unchanged)
    ├── DayMemoriesScreen.tsx       ← Pushed screen: all images for one day
    └── MemoryDetailScreen.tsx      ← Modal: full image + metadata overlay + pinch zoom
```

## Navigation Flow

```
Memories Tab (MemoriesListScreen)
  │
  ├── Groups by date (descending)
  │
  ├── Per day: MemoryGalleryRow
  │     ├── [date header]  [count]
  │     └── [thumb] [thumb] [thumb] [thumb/+N]
  │
  ├── Tap any thumbnail
  │     └── Modal: MemoryDetailScreen (full image + metadata overlay + pinch zoom)
  │
  └── Tap "+N More"
        └── Pushed: DayMemoriesScreen (4-column grid of all images for that date)
              └── Tap any thumbnail → MemoryDetailScreen modal
```

## Data Model

```ts
interface Memory {
  id: string;
  mediaUri: string;       // local file URI or remote URL
  mediaType: 'image' | 'video';
  title: string;
  description: string;
  date: string;           // YYYY-MM-DD
  location: string;
  feeling: MemoryFeeling | null;
  isPrivate: boolean;
  createdAt: string;      // ISO 8601
}
```

## List View (Memories Tab)

| Element | Type | Description |
|---------|------|-------------|
| Title | Text | "Memories" header |
| Add button | Pressable (circular, `+` icon) | Opens Add Memory modal |
| Gallery rows | `MemoryGalleryRow` components in ScrollView | Grouped by date, 4 thumbs per row |
| +N More | Overlay on 4th thumbnail | Semi-transparent dark bg, white "+N More" |
| Empty state | View | Icon + "No memories yet" message |

### States

| State | Behavior |
|-------|----------|
| **Loading** | Reads from SecureStore; falls back to seed data if empty |
| **Empty (no seed)** | Shows icon + message, add button in header |
| **Has data** | ScrollView of gallery rows grouped by date |
| **≤4 per day** | All thumbnails shown, no overlay |
| **>4 per day** | 4th slot shows "+N More" overlay |
| **Private** | Lock icon on thumbnail (via PrivacyBadge) |

## Seed Data

20 mock memories across 5 dates (Jun 8, Jun 5, Jun 2, May 28, May 20) with images from picsum.photos. Loaded automatically when SecureStore is empty — replaced by real data as soon as the user adds their first memory.

## Day Memories Screen (Pushed)

**Route:** `/(modals)/day-memories?date=YYYY-MM-DD`

| Element | Type | Description |
|---------|------|-------------|
| Header | Back button + date title | Pushed within navigation stack |
| Grid | 4-column, gap-2 | All memories for the selected date |
| Thumbnails | Pressable → opens detail modal | Same size and style as main gallery |

## Memory Detail Screen (Modal)

**Route:** `/(modals)/memory-detail?id=`

Full-screen modal with:

| Element | Description |
|---------|-------------|
| Image | Full-width, 60% height, pinch-to-zoom + two-finger pan (Gesture.Pinch + Gesture.Pan) |
| Close | X button top-right (semi-transparent circle) |
| Metadata overlay | Bottom sheet with glass effect (92% opacity): title, description, date, location, feeling, privacy |
| Image zoom | Pinch gesture (1×–4×) + double-finger pan with spring animations |

## Add Memory Modal

**Route:** `/add-memory` (unchanged from previous design)

3-step wizard inside a modal. See previous documentation for full spec.

## Translations

All string keys under `memories.*` in both `en.ts` and `ar.ts`.

## Dependencies

- `react-native-gesture-handler` — pinch-to-zoom + pan gestures
- `react-native-reanimated` — animated zoom transforms
- `expo-image-picker` — media selection
- `expo-secure-store` — local persistence
- `@expo/vector-icons` (Ionicons)
