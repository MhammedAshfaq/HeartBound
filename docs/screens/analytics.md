# Analytics Screen

## Purpose

Show relationship engagement metrics, mood trends, and suggestion breakdowns. Period selector is UI-only for mock data today.

## Implementation

| Item | Value |
|------|--------|
| File | `src/screens/AnalyticsScreen.tsx` |
| Navigator | `MainTabNavigator` → `AnalyticsTab` → `AnalyticsMain` |
| Header | Hidden |
| Data | `MOCK_METRICS`, local `moodData`, `suggestionsByType` |

## Layout

- `screenLayout.safe` + `ScrollView` with `screenScrollContentPadding`

## UI sections

### Header
- Title **Analytics**
- Period toggle: Week | Month | Year (updates local `period` state; metrics unchanged)

### Interaction score
- Large circular score display (`interactionScore`, default 78)

### Stats grid (cards)
- Completion rate %
- Day streak
- Total suggestions

### Mood trends card
- Seven-day row: day label + emoji by mood (Happy, Excited, Neutral, Stressed)

### Suggestions by type card
- Horizontal bar per type: Activities, Messages, Date Nights, Gifts, Compliments
- Count labels; bar width scaled to max count (15)

## Metrics type

`AnalyticsMetrics` from `src/types`:

- `interactionScore`, `completionRate`, `moodTrends`, `streakDays`, `totalSuggestions`

## Future enhancements

- Charts library (e.g. victory-native) for real trends
- Fetch metrics by selected period from API
- Partner comparison view
- Export / share insights
