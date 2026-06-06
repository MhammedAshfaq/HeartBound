# Mobile App Architecture

## Directory Structure

```
apps/mobile/
├── app/                          # Expo Router — file-based routing
│   ├── _layout.tsx               # Root layout (providers, fonts, splash)
│   ├── +not-found.tsx            # 404 screen
│   ├── (auth)/                   # Auth route group
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── otp-verification.tsx
│   │   └── setup-profile.tsx
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Home
│   │   ├── action.tsx
│   │   ├── memories.tsx
│   │   ├── games.tsx
│   │   ├── notification.tsx
│   │   └── profile.tsx
│   └── (modals)/                 # Modal screens
│       ├── _layout.tsx
│       └── add-memory.tsx
│
├── components/                   # Reusable UI components
│   ├── ui/                       # gluestack-ui components
│   ├── common/                   # Shared app components
│   ├── auth/                     # Auth-related components
│   └── home/                     # Feature-specific components
│
├── features/                     # Feature modules (clean architecture)
│   └── memories/                 # Memories feature
│       ├── components/           # Feature-specific components
│       ├── screens/              # Screen components (imported by route files)
│       ├── hooks/                # Feature-specific hooks
│       ├── context/              # Feature-specific context
│       ├── utils/                # Feature utilities
│       └── types/                # Feature type definitions
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

