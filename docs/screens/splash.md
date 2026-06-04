# Splash Screen

## Purpose

Brand intro shown on app launch. Routes the user to the correct flow based on authentication, onboarding, and quiz completion state.

## Implementation

| Item | Value |
|------|--------|
| File | `src/screens/SplashScreen.tsx` |
| Navigator | `AppNavigator` → `Splash` |
| Header | Hidden |

## UI

- Full-screen primary (`#E91E63`) background
- Centered logo (❤️), app name **Relationship Care**, tagline *Nurture your connection*
- No user interaction; auto-navigates after **1.5 seconds**

## Routing logic

Reads Redux state via `useAppSelector`:

| Condition | Destination |
|-----------|-------------|
| `!isAuthenticated` | `Auth` (Login) |
| Authenticated but `!onboardingComplete` | `Auth` (user completes onboarding in auth stack) |
| Authenticated, onboarding done, `!quizComplete` | `Quiz` |
| All complete | `MainTabs` |

Navigation uses `CommonActions.reset` so the user cannot go back to Splash.

## Dependencies

- `@store/hooks` — `auth` and `quiz` slices
- `theme` — colors and spacing for branding

## Future enhancements

- Animated logo
- Remote config / feature flags during splash
- Preload critical data before navigation
