# Mobile App Architecture

## Directory Structure

```
apps/mobile/
├── app/                          # Expo Router — file-based routing
│   ├── _layout.tsx               # Root layout (providers, fonts, splash)
│   ├── +not-found.tsx            # 404 screen
│   ├── (auth)/                   # Auth route group
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Onboarding / Intro Screen
│   │   ├── login.tsx             # Login (phone / social)
│   │   ├── otp-verification.tsx  # OTP 6-digit verification
│   │   ├── relationship-questions.tsx # Modern MCQ Animated Card Wizard
│   │   └── setup-profile.tsx     # Post-login profile setup
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Home Dashboard screen
│   │   ├── action.tsx            # Suggested acts of kindness screen
│   │   ├── memories.tsx          # Memories gallery grid row list
│   │   ├── games.tsx             # Games (unimplemented)
│   │   ├── notification.tsx      # Notifications list
│   │   └── profile.tsx           # Profile settings list
│   └── (modals)/                 # Modal screens
│       ├── _layout.tsx
│       ├── add-memory.tsx        # Add memory wizard flow modal
│       ├── ai-insights.tsx       # AI insights report screen
│       ├── day-memories.tsx      # Day list of memories screen
│       ├── edit-memory.tsx       # Edit memory metadata form
│       ├── edit-profile.tsx      # Edit details form (dob, partner, anniversary)
│       ├── email-verification.tsx# Email update validation modal
│       ├── memory-detail.tsx     # Pinch zoom photo & meta detail card
│       └── relationship-status.tsx# Relationship selector modal
│
├── components/                   # Reusable UI components
│   ├── ui/                       # gluestack-ui components
│   ├── common/                   # Shared app components
│   ├── auth/                     # Auth-related components
│   └── home/                     # Feature-specific components
│
├── features/                     # Feature modules (clean architecture)
│   ├── actions/                  # Actions & kindness suggestions
│   │   ├── components/           # ActionCard, AddCustomActionModal, etc.
│   │   ├── hooks/                # useActions hook
│   │   ├── types/                # Action types
│   │   └── utils/                # Action helpers
│   ├── memories/                 # Memories gallery feature
│   │   ├── components/           # MemoryCard, MoodSelector, MediaPicker, etc.
│   │   ├── screens/              # MemoriesList, AddMemory, DayMemories, EditMemory, MemoryDetail
│   │   ├── hooks/                # useMemories hook
│   │   ├── context/              # MemoriesContext layer
│   │   ├── utils/                # memoryUtils, memoryService layers
│   │   └── types/                # memory types & fallback seeds
│   └── profile/                  # Profile & settings feature
│       ├── components/           # ProfileHeader, SettingsCard, DatePickerModal, etc.
│       ├── data/                 # Profile dummy types
│       ├── screens/              # ProfileScreen, EditProfileScreen, AIInsightsScreen, etc.
│       └── types/                # Profile types definitions
│
├── constants/                    # App-wide constants
│   ├── Colors.ts                 # Theme colors
│   ├── Enums.ts                  # Enum values
│   └── Images.ts                 # Image assets references
│
├── hooks/                        # Custom React hooks
│   ├── useApi.ts                 # API access hook
│   ├── useAuth.ts                # Authentication state
│   ├── useTheme.ts               # Theme management
│   ├── useTranslation.ts         # i18n helper
│   └── useToast.ts               # Toast notifications
│
├── contexts/                     # React Context providers
│   ├── ApiContext.tsx            # API client instances
│   ├── AuthContext.tsx           # Auth state & actions
│   ├── ThemeContext.tsx          # Theme state
│   └── LocalizationContext.tsx   # Locale state
│
├── lib/                          # Utility libraries
│   ├── i18n.ts                   # i18next configuration
│   └── utils/                    # Pure utility functions
│
├── config/                       # App configuration
│   └── size.ts                   # Spacing, sizing tokens
│
├── localization/                 # Translation files
│   ├── index.ts
│   ├── en.ts                     # English
│   └── ar.ts                     # Arabic (if needed)
│
├── assets/                       # Static assets
│   ├── images/
│   └── fonts/
│
├── app.config.js                 # Expo configuration
├── global.css                    # Tailwind / nativewind styles
├── gluestack-ui.config.json      # gluestack-ui theme config
├── nativewind-env.d.ts           # nativewind type declarations
├── declarations.d.ts             # Module declarations (svg, etc.)
├── .eslintrc.js                  # ESLint config
├── .prettierrc                   # Prettier config
├── babel.config.js               # Babel with module-resolver
├── metro.config.js               # Metro bundler config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies & scripts
```

## Key Architectural Decisions

### Routing — Expo Router (file-based)

Replaces the previous `@react-navigation` setup. Routes are defined by the file structure inside `app/`:

- `(auth)/` — Login, OTP, setup profile (no tabs)
- `(tabs)/` — Main screens with bottom tab navigator
- `(modals)/` — Full-screen modal presentations

Root `_layout.tsx` uses `<Stack>` (not `<Slot />`) with route groups registered as screens:

```tsx
<Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="(auth)" />
  <Stack.Screen name="(tabs)" />
  <Stack.Screen name="(modals)" options={{ presentation: 'modal' }} />
</Stack>
```

This enables modal presentation from any tab via `Link href="/(modals)/add-memory"` or `router.push('/(modals)/add-memory' as any)`.

### State Management — React Contexts

Replaces Redux Toolkit with lightweight React Contexts:

| Context | Purpose |
|---------|---------|
| `ApiContext` | API client instances with auto token injection |
| `AuthContext` | User session, login/logout/refresh |
| `ThemeContext` | Light/dark mode with system detection |
| `LocalizationContext` | Language preference |
| `MemoriesContext` | Memory CRUD + SecureStore persistence |

### Styling — nativewind + gluestack-ui

- **nativewind** — Tailwind CSS for React Native (utility-first)
- **gluestack-ui** — Pre-built accessible components built on nativewind
- **global.css** — Theme tokens (HSL variables for light/dark mode)

### API Layer — Generated SDK

API calls use an OpenAPI-generated SDK (`@healthyr/sdk` or similar) consumed through `ApiContext` with automatic:
- Bearer token injection
- 401 interceptor for token refresh
- Request/response middleware

### Internationalization — i18next

- `localization/` — Translation files organized by feature/screen
- `lib/i18n.ts` — i18next init with device locale detection
- `useTranslation()` hook for components

