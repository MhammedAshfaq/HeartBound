# Profile Screen

## Purpose

View and manage account, relationship, partner, preferences, notifications, gift settings, and logout.

## Implementation

| Item | Value |
|------|--------|
| File | `src/screens/ProfileScreen.tsx` |
| Navigator | `MainTabNavigator` → `ProfileTab` → `ProfileMain` |
| Header | Hidden |
| Tab icon | `person` / `person-outline` |

## Layout

- `screenLayout.safe` + `ScrollView` with `screenScrollContentPadding`

## UI sections

### Profile header
- Avatar initial from `user.name`
- Name, age, email from `useAuth().user`

### Relationship info card
- Status from `relationshipDetails.type` (dating, married, engaged, long_term)
- Anniversary date (`formatDate`)
- Duration together (`differenceInMonths` helper)

### Partner details card
- If `partner` in Redux: name, birthday link, interests link, love language chips
- If no partner: placeholder *No partner connected yet*
- Several actions show **Coming Soon** alert

### Insights card (mock)
- Score 75%, Engagement 85%, 7-day streak

### Preferences card (mock / stub)
- Notification frequency, activity type, best notify time — alert on tap

### Notifications card
- Push notifications `Switch` (local state only)

### Gift settings card (stub)
- Budget range, favorite categories, wishlist — alert on tap

### Account card
- Change phone/email (stub)
- Linked accounts: Google (Connected), Facebook / Apple (Connect)

### Logout
- Confirmation `Alert` → `logout()` → reset navigation to `Auth`

### Footer
- Version **1.0.0**

## Data sources

| Data | Source |
|------|--------|
| User | `useAuth().user` |
| Partner | `partnerSlice` |
| Relationship | `userSlice.relationshipDetails` |
| Insights / many settings | Hardcoded or local UI state |

## User actions

| Action | Behavior |
|--------|----------|
| Toggle push notifications | Local `notificationsEnabled` state |
| Logout | Clears session and returns to auth flow |
| Stub rows | `Alert.alert('Coming Soon')` |

## Future enhancements

- Edit profile screen
- Persist notification and gift preferences
- Real OAuth link / unlink
- Profile completion percentage
- AI-generated insights from analytics data
