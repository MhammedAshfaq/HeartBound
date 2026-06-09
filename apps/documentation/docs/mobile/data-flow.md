# Data Flow & Architecture

Audience: Senior Management, Tech Lead, Release Manager
Purpose: Understand how data moves through the app without reading code.

---

## Auth Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Login      │────▶│   Backend    │────▶│   Session    │
│   Screen     │     │   API        │     │   Context    │
│              │     │              │     │              │
│ email+pass   │     │ validate     │     │ store tokens │
│ → POST       │     │ → return     │     │ + user in    │
│ /v1/auth/    │     │ accessToken  │     │ SecureStore  │
│   login      │     │ refreshToken │     │ (encrypted)  │
│              │     │ user         │     │              │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                                                 ▼
                                        ┌──────────────────┐
                                        │   API Context    │
                                        │                  │
                                        │ auto-injects     │
                                        │ Bearer token on  │
                                        │ every request    │
                                        │                  │
                                        │ on 401: auto     │
                                        │ refresh via      │
                                        │ /v1/auth/refresh │
                                        └──────────────────┘
```

**Key Points:**
- Tokens never stored in plain AsyncStorage — uses SecureStore (iOS Keychain / Android Keystore)
- On 401 response, the API layer automatically retries with a refreshed token
- If refresh fails, session is cleared and user is redirected to Login
- Session survives app restarts (no re-login needed until token expires)

---

## Provider Hierarchy

Wrapping order (outermost → innermost):

```
GestureHandlerRootView        # Gesture handling (pinch, pan, swipe)
  └── GluestackUIProvider      # Theming context for gluestack-ui
      └── AppThemeProvider     # Light/dark/system mode state
          └── ThemeProvider    # Navigation theme (@react-navigation)
              └── LocalizationProvider   # i18n state (en/ar)
                  └── SessionProvider     # Encrypted session store
                      └── QueryClientWithToken   # @tanstack/react-query cache
                          └── ApiProvider        # Axios client with auto-auth
                              └── AuthProvider   # Auth business logic
                                  └── MemoriesProvider  # Memory CRUD + SecureStore
                                      └── <Slot />   # Active route screen
```

**Data Flow Direction:**
- Props / context flow **down** (outer → inner)
- API calls flow **up** (screen → hook → context → Axios → Backend)
- Session state flows **sideways** (SessionContext → AuthContext → ApiContext)

---

## Screen Data Flow

### Screen → Hook → Context → API

```text
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Screen  │────▶│  Hook    │────▶│ Context  │────▶│  API     │
│ (route)  │     │          │     │ (state)  │     │ (Axios)  │
├──────────┤     ├──────────┤     ├──────────┤     ├──────────┤
│ Login    │     │ useAuth  │     │ AuthCtx  │     │ authClnt │
│ calls    │────▶│ .login() │────▶│ .login() │────▶│ POST     │
│ handle() │     │          │     │          │     │ /login   │
└──────────┘     └──────────┘     └────┬─────┘     └──────────┘
                                       │
                                       ▼
                                ┌──────────────┐
                                │ SessionCtx   │
                                │ setSession() │
                                │ → SecureStr  │
                                └──────────────┘
```

**Post-login Setup:**

```text
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│ Auth     │────▶│ Setup Profile │────▶│ SessionCtx   │────▶│ Tabs     │
│ success  │     │ screen        │     │ update user  │     │ routes   │
└──────────┘     └──────────────┘     └──────────────┘     └──────────┘
```

- After successful OTP or OAuth login, the app routes to Setup Profile to collect essential details before entering tabs.
- Setup Profile updates the stored user profile in SessionContext so the rest of the app can render the saved name immediately.

**Cached Data Flow (react-query):**

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Screen  │────▶│ useQuery │────▶│  Cache   │────▶│  API     │
│          │     │ (hook)   │     │ (react-  │     │          │
│          │     │          │     │  query)  │     │          │
│ renders  │◀────│ data     │◀────│ stale=5m │◀────│ response │
│ with     │     │          │     │ retry=2  │     │          │
│ data     │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

---

## i18n Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Device      │────▶│  i18next     │────▶│  Screen      │
│  Locale      │     │  (lib/)      │     │              │
│              │     │              │     │              │
│ en / ar      │     │ selects      │     │ t('key')     │
│ detected     │     │ translation  │     │ → "Welcome"  │
│ via expo-    │     │ file         │     │              │
│ localization │     │              │     │              │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │  Translation   │
                   │  Files         │
                   │                │
                   │ localization/  │
                   │ ├── en.ts      │
                   │ └── ar.ts      │
                   │                │
                   │ Keys organized │
                   │ by screen:     │
                   │ auth.login     │
                   │ auth.setupProfile │
                   │ home.greeting  │
                   │ tabs.*         │
                   └────────────────┘
```

**Key Points:**
- All user-facing strings go through `t()` function
- No hardcoded strings in components
- Arabic RTL layout supported via `isRTL` flag from LocalizationContext

---

## Theme Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Device      │────▶│ ThemeContext  │────▶│  Screen /    │
│  Setting     │     │              │     │  Component   │
│              │     │ mode: system │     │              │
│ light/dark   │     │ / light/dark │     │ useTheme()   │
│ (OS-level)   │     │              │     │ → isDark     │
│              │     │ toggleTheme()│     │              │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │  Colors.ts     │
                   │                │
                   │ light: { ... } │
                   │ dark: { ... }  │
                   │                │
                   │ 14 semantic    │
                   │ color keys     │
                   └────────────────┘
```

---

## File-to-Feature Map

| File | Layer | Purpose |
|------|-------|---------|
| `SessionContext.tsx` | Storage | Encrypted read/write of auth tokens |
| `ApiContext.tsx` | Network | Axios client with auto-auth + 401 refresh |
| `AuthContext.tsx` | Business Logic | Login, OTP, OAuth, logout orchestration |
| `ThemeContext.tsx` | UI State | Light/dark/system mode |
| `LocalizationContext.tsx` | i18n | Language selection, RTL flag |
| `QueryClientWithToken.tsx` | Cache | React Query provider for API caching |
| `lib/i18n.ts` | i18n | i18next initialization |
| `lib/utils/secureStorage.ts` | Storage | SecureStore helpers |
| `lib/utils/formatter.ts` | Formatting | Date, string utilities |
| `constants/Colors.ts` | Design | 14 light + 14 dark color tokens |
| `constants/Enums.ts` | Domain | Mood, status, memory type enums |
| `features/memories/context/MemoriesContext.tsx` | Feature State | Memory CRUD + SecureStore persistence |
| `features/memories/hooks/useMemories.ts` | Feature Hook | Public API for memories feature |
| `features/memories/utils/memoryService.ts` | Storage | SecureStore read/write for memories |
| `features/memories/types/memory.types.ts` | Types | Memory interface, payload types |
