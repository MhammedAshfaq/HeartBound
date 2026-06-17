# Relationship Questions Screen

**Route:** `app/(auth)/relationship-questions.tsx`
**Status:** ✅ Done

## Overview

The Relationship Questions Screen is a post-registration / onboarding onboarding questionnaire. It displays a 5-step animated question wizard to gather relationship preferences, love languages, and relationship duration.

## UI Layout & Components

```
┌──────────────────────────────────────────────┐
│  [← Back]        Relationship Questions  1/5 │  ← Header: progress details
├──────────────────────────────────────────────┤
│  [============ Progress Bar (20%) ==========]│  ← Smooth progress indicator
├──────────────────────────────────────────────┤
│                                              │
│         [ Animated Question Card ]           │
│                                              │
│                 ( Icon )                     │
│          How long have you been              │
│                together?                     │
│                                              │
│        [ A. Less than 6 months  (Radio) ]    │  ← Selectable option rows
│        [ B. 6 months to 1 year  (Radio) ]    │
│        [ C. 1 to 3 years        (Radio) ]    │
│        [ D. 3 to 5 years        (Radio) ]    │
│        [ E. More than 5 years   (Radio) ]    │
│                                              │
├──────────────────────────────────────────────┤
│  [ Back ]                        [ Next → ]  │  ← Navigation controls
└──────────────────────────────────────────────┘
```

### 1. Header Bar
- **Back Button:** Standard circular icon button. Navigates to the previous question step, or back out of the questionnaire if on step 1.
- **Title:** Header title "Relationship Questions" (`questions.title` translated).
- **Step Counter:** Real-time step counter displaying `Current Step / Total Steps` (e.g. `3 / 5`).

### 2. Progress Indicator
- Horizontal progress bar filled to the current step percentage, utilizing color-coded indicator highlights.

### 3. Animated Question Card
- Contained card with subtle borders and shadows.
- Uses `Animated.parallel` to perform a slide-left and fade-out transition when navigating to another question, followed by a slide-in and fade-in for the new question.
- **Question Icon:** A themed vector icon (`Ionicons`) representing the topic of the current question.
- **Question Label:** Displayed in a prominent title format.
- **Multiple Choice Options:** Custom list of pressable rows. Selecting a row shows feedback, highlights a radio indicator circle, and triggers an auto-advance with a 350ms delay.

### 4. Navigation Footer
- **Back Button:** Text button appearing on steps 2 to 5 to step backward in the questionnaire.
- **Next / Done Button:** Displays "Next" with a forward arrow for steps 1-4, or "Done" on step 5. Submission triggers a loading spinner before routing the user to the main tabs dashboard.

---

## Question Data Definition

The questionnaire consists of 5 fixed steps:

| Step | Topic Key | Description / Options | Icon |
|------|-----------|-----------------------|------|
| 1 | `q1` | **Relationship Duration:** less than 6 months, 6 months to 1 year, 1 to 3 years, 3 to 5 years, more than 5 years. | `hourglass-outline` |
| 2 | `q2` | **Love Language:** words of affirmation, quality time, receiving gifts, acts of service, physical touch. | `heart-outline` |
| 3 | `q3` | **Date Night Frequency:** weekly, biweekly, monthly, rarely, never. | `wine-outline` |
| 4 | `q4` | **Core Values:** communication, trust, shared interests, mutual respect, emotional support. | `shield-checkmark-outline` |
| 5 | `q5` | **Favorite Activity:** travelling, cooking, movies, outdoor, talking. | `sparkles-outline` |

---

## Technical Details

### Animation Logic
The screen manages slide and fade properties through Animated values:
```typescript
const fadeAnim = useRef(new Animated.Value(1)).current;
const slideAnim = useRef(new Animated.Value(0)).current;
```

When shifting questions, the active card slides left (transforming translation by `-20`) and fades to `0`, updates the current index state, resets the card position to the right (translation `20`), and fades back to `1` with a slide to `0`.

### State Management
- **`currentIndex`**: Tracking the active question index (0 to 4).
- **`answers`**: Key-value map storing user selections (e.g., `{ q1: '1to3', q2: 'qualityTime' }`).
- **`loading`**: Boolean indicating the submission state when "Done" is tapped.

---

## Localization Keys

Translation keys are located in `localization/en.ts` and `ar.ts` under:
- `questions.title`
- `questions.subtitle`
- `questions.q1` through `questions.q5`
- Options: `questions.less6`, `questions.affirmation`, `questions.weekly`, etc.
