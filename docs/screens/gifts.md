# Gift Ideas Screen

## Purpose

Browse curated gift suggestions by category and save ideas for later (save action is stubbed).

## Implementation

| Item | Value |
|------|--------|
| File | `src/screens/GiftsScreen.tsx` |
| Navigator | `MainTabNavigator` → `GiftsTab` → `GiftsMain` |
| Header | Hidden (custom in-screen header) |
| Data | `GIFT_IDEAS` constant array (6 items) |

## Layout

- `screenLayout.safe`
- Header block: `screenPadding`
- `FlatList`: `screenPadding` + `screenScrollBottomPadding`

## UI

- Title **Gift Ideas** and subtitle
- Cards per gift:
  - Emoji + category badge (Romantic, Experience, Creative)
  - Title and description
  - **Save Idea** outline button

## Sample categories

| Category | Example |
|----------|---------|
| Romantic | Photo album, love letter, surprise date |
| Experience | Spa day, cooking class |
| Creative | Custom playlist |

## User actions

| Action | Behavior |
|--------|----------|
| Save Idea | No-op (`onPress={() => {}}`) — placeholder |

## Dependencies

- `Card`, `Button` common components

## Future enhancements

- Persist saved gifts to Redux / API
- Filter by budget from Profile settings
- Partner wishlist sync
- Affiliate / purchase links
