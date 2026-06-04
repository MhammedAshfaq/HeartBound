# Notifications Screen

## Purpose

Display in-app notification history with read/unread state and bulk mark-as-read.

## Implementation

| Item | Value |
|------|--------|
| File | `src/screens/NotificationsScreen.tsx` |
| Navigator | `MainTabNavigator` → `NotificationsTab` → `NotificationsMain` |
| Header | Hidden (custom in-screen header) |
| Data | `MOCK_NOTIFICATIONS` (local state) |

## Layout

- `screenLayout.safe`
- Header: `screenPadding` on all sides
- `FlatList` content: `screenPadding` + `screenScrollBottomPadding`

## UI

- Title **Notifications**
- **Mark all as read** (visible when unread count > 0)
- List items: icon, title, message, relative timestamp (`formatRelativeTime`)
- Unread items: left primary border accent
- Icons by type: 🎉 (`SpecialEvent`) or 💝 (default)
- Empty state: bell emoji + *No notifications yet*

## User actions

| Action | Behavior |
|--------|----------|
| Tap notification | Marks that item `read: true` |
| Mark all as read | Sets all items to read |

## Mock notification types

Uses `NotificationTrigger` enum — e.g. `TimeBased`, `SpecialEvent`.

## Future enhancements

- Push notification integration (Expo Notifications)
- Deep links from notification tap to Home / Gifts
- Pagination and API sync
- Swipe-to-delete
