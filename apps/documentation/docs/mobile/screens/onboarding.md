# Onboarding Screen

**Route:** `app/(auth)/index.tsx`
**Status:** ✅ Done (Onboarding information with feature overview)

---

## What This Screen Contains

This screen acts as the initial welcoming experience for new users, especially focused on busy professionals (corporate workers) who want to build and nurture meaningful relationships.

### Header / Brand Section
- **Icon / Logo:** Premium customized layout showing app identity.
- **Value Proposition Headline:** "Stronger Bonds for Busy Lives" (dynamically translated).
- **Subheadline:** Introduces the app's mission to help users stay connected despite occupied calendars.

### Feature Overview Cards
A sequence of visually rich, high-contrast sections presenting core pillars:
1. **Smart Suggestions:** Meaningful actions tailored for busy couples.
2. **Shared Memories:** A private lane to document your special moments.
3. **Deeper Connection:** Deep dive into analytics and your bond.

### Action Bar
- **Get Started Button:** Primary solid action button that navigates the user to the dedicated Login screen (`app/(auth)/login.tsx`).

---

## Navigation & Flow

- **App Launch:** When a user opens the app without an active session, they land here first.
- **User Action:** Tap "Get Started" -> transitions smoothly to `app/(auth)/login.tsx`.
- **Logout:** Redirects the user to `app/(auth)/index.tsx` (this screen).

---

## States & Design Details

- **Responsive Layout:** Scrollable container fitting both small and large screen dimensions gracefully.
- **Theme Support:** Adapts to dark/light themes. Uses HSL tailored color palette values through the local theme file.
- **i18n Support:** Fully translated in English (`en.ts`) and Arabic (`ar.ts`).
