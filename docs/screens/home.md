# Home Screen

## Purpose

Central hub for daily engagement: relationship stats, today’s suggestion, mood logging, and upcoming events.

## Implementation

| Item | Value |
|------|--------|
| File | `src/screens/HomeScreen.tsx` |
| Navigator | `MainTabNavigator` → `HomeTab` → `HomeMain` |
| Header | Hidden |
| Tab icon | `home` / `home-outline` |

## Layout

- `screenLayout.safe` + `ScrollView` with `screenScrollContentPadding` (24px sides, 48px bottom)

## UI sections

### Greeting header
- *Good Morning!* and subtitle
- Current mood emoji button (displays logged mood or default 😊)

### Stats row (cards)
- **Relationship Score** — mock 75%
- **Day Streak** — mock 5 days

### Today’s suggestion card
- Title and description from `useSuggestions().current`
- Actions: **Accept**, **Done** (secondary), **Skip** (text)
- Loading placeholder when no suggestion loaded

### Mood selector card
- Six moods: Happy, Excited, Neutral, Stressed, Sad, Angry
- Emoji per mood via `getMoodEmoji`
- Tap logs mood through `useMood().logMood`

### Upcoming card
- Anniversary countdown via `daysUntilAnniversary` (mock date `2025-06-15`)

## Data & hooks

| Hook | Usage |
|------|--------|
| `useSuggestions` | Fetch daily suggestion, accept / complete / skip |
| `useMood` | Log mood, read `currentMood`, fetch 7-day history on mount |

On mount: `fetchDailySuggestion(Neutral, Weekday)` and `fetchMoodHistory(7)`.

## User actions

| Action | Behavior |
|--------|----------|
| Log mood | Updates current mood in store |
| Accept / Done / Skip suggestion | Dispatches suggestion actions by `current.id` |
| Mood emoji (header) | Display only in current implementation |

## Future enhancements

- Time-based greeting (morning / afternoon / evening)
- Real anniversary from `userSlice`
- Partner activity feed
- Pull-to-refresh for suggestion
