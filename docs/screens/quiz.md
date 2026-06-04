# Preference Quiz Screen

## Purpose

Collect five multiple-choice answers after onboarding (or after OTP for returning users) to personalize suggestions. Answers are stored in Redux before entering the main app.

## Implementation

| Item | Value |
|------|--------|
| File | `src/screens/QuizScreen.tsx` |
| Navigator | `AppNavigator` → `Quiz` |
| Header | Hidden |
| Questions | `QUIZ_QUESTIONS` in `src/utils/constants.ts` |

## Layout

- `screenLayout.safe` + `ScrollView` with `screenScrollContentPadding`
- Fixed footer with primary **Next** / **Complete** button (`screenPadding`)

## UI

- Progress bar and step counter (`1 / 5` … `5 / 5`)
- Question text
- Radio-style option list (emoji + label per option)
- Footer button disabled until an option is selected

## Questions (implemented)

| ID | Question |
|----|----------|
| `loveExpression` | How do you usually express love? |
| `partnerPreference` | What does your partner like most? |
| `interactionFrequency` | How often do you interact daily? |
| `goal` | What is your main goal? |
| `dailyTime` | How much time can you spend daily for your partner? |

## User actions

| Action | Behavior |
|--------|----------|
| Select option | Updates local `answers` state |
| Next | Advances step |
| Complete (last step) | `saveAnswers(quizData)` → `finishQuiz()` → reset to `MainTabs` |

If `quizSlice.isComplete` is already true on mount, auto-navigates to `MainTabs`.

## Data shape

Saved as `QuizAnswers` in Redux:

- `loveExpression`, `partnerPreference`, `interactionFrequency`, `goal`, `dailyTime`

## Dependencies

- `useQuiz` — persist and completion flag
- `Button` — footer CTA

## Future enhancements

- Back navigation between questions
- Skip with defaults
- Sync answers to backend API
