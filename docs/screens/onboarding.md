# Setup Profile (Onboarding) Screen

## Purpose

Three-step first-time setup: personal details, relationship details, and partner invite. Shown in the auth stack with the header title **Setup Profile**.

## Implementation

| Item | Value |
|------|--------|
| File | `src/screens/OnboardingScreen.tsx` |
| Navigator | `AuthNavigator` → `Onboarding` |
| Header | Shown — title **Setup Profile** |
| Layout | `screenLayout.safeSurface` + `screenLayout.scrollContent`, `edges={['bottom']}` |

## Step indicator

Three dots at top; active steps use primary color.

---

## Step 1 — Personal details

| Field | Control | Validation |
|-------|---------|------------|
| Name | `Input` | `personalDetailsSchema` |
| Age | `Input` (number pad) | `personalDetailsSchema` |
| Gender | Chip options from `GENDER_OPTIONS` | Required |

**Next** → `updateProfile({ name, age, gender })` via `useAuth`, then advance to step 2.

---

## Step 2 — Relationship details

| Field | Control | Validation |
|-------|---------|------------|
| Relationship type | Chips from `RELATIONSHIP_TYPES` | `relationshipDetailsSchema` |
| Anniversary | `DateTimePicker` (native) | Required date |

**Back** → step 1. **Next** → step 3 (relationship data saved locally in form; step advance only).

---

## Step 3 — Partner invite

| Element | Behavior |
|---------|----------|
| Invite code display | Static mock `ABCD1234` |
| Copy Code | Stub (`onPress={() => {}}`) |
| Share Invite | Stub |
| Partner code input | `Input` (no submit wiring) |
| **Back** | Step 2 |
| **Complete** | `completeOnboarding()` → reset app stack to `Quiz` |

---

## Forms

- `react-hook-form` + `yupResolver` for steps 1 and 2
- `Loading` overlay — *Saving...* during async profile update

## Navigation entry

Typically reached from `OTPVerification` when `loginWithOTP` returns `isNewUser: true`.

## Related screen

Post-onboarding preference questions live on the separate [Quiz screen](./quiz.md), not inside this flow’s UI.

## Future enhancements

- Generate real invite codes via API
- Save relationship details to `userSlice` on step 2 submit
- Deep link for partner pairing
- Skip partner invite and complete later
