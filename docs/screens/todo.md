# To-Do Screen

## Purpose

Relationship-focused task list for daily gestures, dates, gifts, and communication goals—not a generic productivity app.

## Implementation

| Item | Value |
|------|--------|
| File | `src/screens/TodoScreen.tsx` |
| Navigator | `MainTabNavigator` → `TodoTab` → `TodoMain` |
| State | `todoSlice` (Redux, persisted) |
| Hook | `useTodos` |

## Actions

| Action | How |
|--------|-----|
| Add task | **Add Task** → modal (title, notes, priority, category) |
| Edit task | Tap task body → same modal |
| Toggle complete | Tap checkbox |
| Delete task | Tap trash → confirm |
| Filter | **All** / **Active** / **Done** |
| Complete all | **Complete all** (active tasks only) |
| Clear completed | **Clear done** |

## Task fields

- **Priority:** Low, Medium, High
- **Category:** Connection, Date, Gift, Talk, Other

## Persistence

Todos are stored in AsyncStorage via `redux-persist` (`todo` whitelist).

## Related files

- `src/store/slices/todoSlice.ts`
- `src/hooks/useTodos.ts`
- `src/utils/todoConstants.ts`
