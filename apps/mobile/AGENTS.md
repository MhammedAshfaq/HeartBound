# Mobile App — Agent Rules

## CRITICAL: Documentation-First Rule

**BEFORE implementing any change, update the documentation first.**

All mobile documentation lives in `apps/documentation/docs/mobile/`:

| Document | Purpose | Update When... |
|----------|---------|----------------|
| `screens/{screen}.md` | Screen fields, buttons, data, states | Adding/modifying a screen |
| `features.md` | Feature inventory & status | Adding/removing a feature |
| `data-flow.md` | Auth flow, provider hierarchy | Changing state/API architecture |
| `architecture.md` | Directory structure, routing | Changing project structure |
| `getting-started.md` | Setup, commands, env vars | Adding dependencies or scripts |
| `standards.md` | Conventions & patterns | Establishing new patterns |

**Workflow:**
1. Identify which doc(s) need updating
2. Make the doc changes first (content + sidebars if needed)
3. Then implement the code changes
4. Verify docs are still accurate after implementation

---

## 1. Architecture (NEVER guess — follow these exactly)

| Layer | Decision | NOT |
|-------|----------|-----|
| **Routing** | Expo Router — file-based in `app/` | DO NOT use `@react-navigation` directly |
| **Styling** | nativewind utility classes (`className`) | DO NOT use `StyleSheet.create` (except animations) |
| **State** | React Contexts in `contexts/` | DO NOT add Redux, Zustand, or any state library |
| **i18n** | `useTranslation()` from `react-i18next` | DO NOT hardcode user-facing strings |
| **API** | Axios through `ApiContext` / `useApi()` | DO NOT use raw `fetch` or direct `axios` |
| **Data Fetching** | `@tanstack/react-query` via `QueryClientWithToken` | DO NOT use `useEffect` for API calls |
| **Fonts** | Plus Jakarta Sans (Google Fonts) + SF Pro (bundled) | DO NOT add new font files without approval |
| **Toasts** | `useToast()` hook (wraps `burnt` library) | DO NOT use `Alert.alert` for notifications |

### Provider Hierarchy (outermost → innermost)

```
GluestackUIProvider → AppThemeProvider → ThemeProvider (@react-navigation)
  → LocalizationProvider → SessionProvider → QueryClientWithToken
    → ApiProvider → AuthProvider → <Slot />
```

**DO NOT** reorder or add providers to this chain unless explicitly asked.

### Existing Contexts (5 total — do not add more unless asked)

| Context | File | Purpose |
|---------|------|---------|
| SessionContext | `contexts/SessionContext.tsx` | SecureStore read/write of auth tokens |
| ApiContext | `contexts/ApiContext.tsx` | Axios client with Bearer token + 401 refresh |
| AuthContext | `contexts/AuthContext.tsx` | login, OTP, OAuth, logout orchestration |
| ThemeContext | `contexts/ThemeContext.tsx` | light/dark/system mode |
| LocalizationContext | `contexts/LocalizationContext.tsx` | en/ar locale, RTL flag |

---

## 2. File & Directory Conventions

```
app/                          ← Expo Router routes (kebab-case)
  _layout.tsx                 ← Root layout file
  (auth)/index.tsx            ← Route group + screen
  (tabs)/memories.tsx         ← Tab screen

components/                   ← Reusable components (PascalCase)
  ui/                         ← gluestack-ui primitives
  common/                     ← Shared app components
  auth/                       ← Auth-specific components

contexts/                     ← PascalCaseContext.tsx
hooks/                        ← useCamelCase.ts
constants/                    ← PascalCase.ts
lib/utils/                    ← camelCase.ts
localization/                 ← en.ts, ar.ts (language codes)
```

### Naming Rules

| Type | Convention | Example | Rule |
|------|-----------|---------|------|
| Route files | kebab-case | `otp-verification.tsx` | **MUST** match route path |
| Route layouts | kebab-case | `_layout.tsx` | **MUST** be named `_layout.tsx` |
| Components | PascalCase | `ProfileHeader.tsx` | **MUST** match export name |
| Hooks | camelCase + `use` prefix | `useMemories.ts` | **MUST** start with `use` |
| Contexts | PascalCase + `Context` | `AuthContext.tsx` | **MUST** end with `Context` |
| Translation keys | dot-notation | `home.moodQuestion` | **MUST** be nested by screen |
| Utilities | camelCase | `formatDate.ts` | |

---

## 3. Import Rules

**ALWAYS** use the `@/` alias (maps to project root):

```tsx
// ✅ CORRECT
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import { Colors } from '@/constants/Colors'

// ❌ WRONG — no relative paths outside current directory
import { Button } from '../../components/common/Button'
```

**ALWAYS** check existing exports before creating new:

- Context is already exported? Use it. Don't create another.
- Hook already exists? Re-export it. Don't duplicate.
- Translation key already exists? Reuse it.

---

## 4. Common Mistakes to AVOID

| Mistake | Why It's Wrong |
|---------|----------------|
| Creating `src/` directory | Routes live in `app/`, code in `components/`/`hooks/`/etc. |
| Using `StyleSheet.create` for layout styles | Use nativewind `className` props instead |
| Adding new Context provider | 5 contexts cover all needs — ask before adding more |
| Adding new npm dependency | Check `package.json` first — approve with user |
| Using `expo-router` older APIs | SDK 54 uses expo-router v6 — check v6 docs |
| Hardcoding strings | Every string goes through `t()` from `useTranslation()` |
| Direct `axios`/`fetch` calls | Always go through `useApi().authClient` |
| `console.log` in production | Use `logError()` from `lib/utils/logError.ts` |
| Storing tokens in AsyncStorage | Use `expo-secure-store` (via SessionContext) |
| Using `@react-navigation` directly | Expo Router handles navigation — use `<Link>`, `useRouter()` |
| Forgetting Arabic translations | Every new key in `en.ts` needs a corresponding entry in `ar.ts` |
| Guessing API endpoints | Backend endpoints follow `/v1/{resource}` pattern — verify |
| Using `any` type | Use proper interfaces or `unknown` |

---

## 5. Before Marking a Task Complete

Run these:

```bash
pnpm type-check    # Fix ALL TypeScript errors
pnpm lint          # Fix ALL warnings
```

Then verify:

- [ ] New screens documented in `apps/documentation/docs/mobile/screens/`
- [ ] Feature status updated in `apps/documentation/docs/mobile/features.md`
- [ ] Translations added to BOTH `en.ts` AND `ar.ts`
- [ ] No `console.log` left in production code
- [ ] No hardcoded strings in components
- [ ] No `any` types (use `unknown` or proper interface)
- [ ] No new dependencies added without approval
- [ ] Dark mode supported (check both light + dark)
- [ ] Changed `architecture.md`, `data-flow.md`, or `getting-started.md` if applicable

---

## 6. Expo SDK Version Reference

- **Expo SDK:** 54
- **React Native:** 0.81.5
- **Expo Router:** v6
- **React:** 19.1.0
- **TypeScript:** 5.9

**ALWAYS** check https://docs.expo.dev/versions/v54.0.0/ before writing Expo code.

---

## 7. Documentation Location Reference

All mobile documentation is at `apps/documentation/docs/mobile/`:

```
apps/documentation/docs/mobile/
├── overview.md              ← Tech stack + doc index
├── architecture.md          ← Directory structure, routing, decisions
├── getting-started.md       ← Setup, env vars, commands
├── standards.md             ← Coding conventions
├── features.md              ← Feature summary with status
├── data-flow.md             ← Auth flow, provider hierarchy
└── screens/                 ← One file per screen
    ├── overview.md          ← Screen index
    ├── login.md
    ├── otp-verification.md
    ├── home.md
    ├── memories.md
    ├── analytics.md
    └── profile.md
```

New screens MUST get a corresponding `.md` file in `screens/`.

---

## 8. Root monorepo CLAUDE.md must also be updated if the mobile project structure changes (directory paths, package names, etc.).
