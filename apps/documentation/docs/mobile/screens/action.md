# Action Screen

**Path:** `app/(tabs)/action.tsx`
**Purpose:** Suggest actionable tasks or behaviors the user can do to strengthen their relationship, allow them to mark these as completed, add custom completed actions, and request new suggestions.

## Overview

The Action Screen is a core engagement loop. It presents the user with AI-curated (or categorized) relationship-building suggestions. Users can check these off, pinning them to a "Completed Today" list, or they can refresh to get new ideas. Users can also document their own unprompted romantic gestures via the "Add Custom Action" feature.

## Data Models

```typescript
type ActionCategory = 'gift' | 'service' | 'words' | 'time' | 'custom';

interface ActionTask {
  id: string;
  title: string;
  description?: string;
  category: ActionCategory;
  isCompleted: boolean;
  isCustom: boolean;
  createdAt: string;
  completedAt?: string;
}
```

## UI Layout & Components

### 1. Header
- Displays a welcoming title (e.g., "Today's Actions").
- Subtitle encouraging the user to make an impact.

### 2. Completed Actions (Top Section)
- Only visible if the user has completed at least one action today.
- Displays a vertical list of `ActionCard` components with a "Completed" visual state (e.g., dimmed, checkmark icon, strikethrough).

### 3. Active Suggestions (Middle Section)
- Displays up to 4 pending `ActionCard` suggestions.
- Each card has a prominent "Mark as Done" button.

### 4. Footer Actions
- **Refresh Suggestions Button:** Replaces the current pending suggestions with a fresh batch from the predefined list or backend.
- **Add Custom Action Button:** Opens a modal/sheet.

### 5. Add Custom Action Modal
- **Fields:**
  - `title` (Text Input): What did you do?
- **Behavior:** On submit, immediately creates an `ActionTask` with `isCustom: true` and `isCompleted: true`, adding it to the top section.

## State Management
- Handled locally via `ActionContext.tsx` combined with `@react-native-async-storage/async-storage` for persistence, simulating backend behavior.

## Future Enhancements
- Integration with AI `/v1/actions/suggestions` endpoint.
- Streaks, points, and gamification ties to the Games feature.
- Multi-player sync (seeing what your partner did).
