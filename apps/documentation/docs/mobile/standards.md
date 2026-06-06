# Mobile Coding Standards

## General Principles

- **TypeScript** everywhere — no `any` unless absolutely necessary
- **Functional components** with hooks — no class components
- **Imports** use `@/` alias mapping to project root
- **No inline styles** — use nativewind classes or `constants/Colors`

## Directory & File Conventions

### Naming

| Type | Convention | Example |
|------|-----------|---------|
| Route files | kebab-case | `otp-verification.tsx` |
| Components | PascalCase | `ProfileAvatar.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Contexts | PascalCase with `Context` suffix | `AuthContext.tsx` |
| Constants | PascalCase | `Colors.ts`, `Enums.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Translations | camelCase keys | `auth.login.title` |

### Folder Structure per Feature

Group related files by feature, not by type:

```
components/
├── auth/
│   ├── LoginForm.tsx
│   ├── OTPInput.tsx
│   └── SocialLoginButtons.tsx
├── home/
│   ├── MoodCard.tsx
│   └── MemoryPreview.tsx
└── common/
    ├── Button.tsx
    ├── Header.tsx
    └── LoadingSpinner.tsx
```

## Component Standards

```tsx
import { View, Text } from 'react-native'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  title: string
  onPress: () => void
}

export function ProfileHeader({ title, onPress }: Props) {
  const { t } = useTranslation()

  return (
    <View className="px-4 py-3">
      <Text className="text-lg font-bold text-foreground">{title}</Text>
    </View>
  )
}
```

- Prefer function declarations (`export function Foo`) over arrow functions
- Props typed as `type Props = {...}` exported from the component file
- Destructure props in the function signature

## State Management

### Use React Context for global state

```tsx
// contexts/AuthContext.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Use local state / hooks for feature state

```tsx
// hooks/useMemories.ts
export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMemories = async () => { ... }

  return { memories, loading, fetchMemories }
}
```

## API Calls

All API calls go through `ApiContext` which provides auto-configured SDK clients:

```tsx
import { useApi } from '@/hooks/useApi'

export function useMemories() {
  const { listing } = useApi()

  const fetchMemories = async () => {
    const res = await listing.listingControllerFindAll()
    return res.data
  }

  return { fetchMemories }
}
```

- No raw `axios` or `fetch` calls outside the API layer
- Handle 401 via middleware in `ApiContext` (auto refresh)
- Errors handled by the caller or a global error boundary

## Internationalization

All user-facing strings go through the i18n system:

```tsx
const { t } = useTranslation()

<Text>{t('home.greeting')}</Text>
```

- Translation keys are nested by feature/screen (e.g., `auth.login.title`)
- No hardcoded user-facing strings in components

## Styling with nativewind

```tsx
<View className="flex-1 bg-background p-4">
  <Text className="text-lg font-bold text-foreground">Hello</Text>
</View>
```

- Use nativewind utility classes over StyleSheet
- Use `constants/Colors` for theme values only when nativewind cannot express them
- No inline `style={}` props except for animations

## File Organization per Module

Each module (e.g., `auth`) should follow a consistent pattern:

```
components/auth/
├── LoginForm.tsx       # Main component
├── LoginForm.test.tsx  # Tests (co-located)
├── SocialLogin.tsx     # Sub-component
└── index.ts            # Barrel export (optional)
```

## What to Avoid

- ❌ `any` types — use proper interfaces or `unknown`
- ❌ Inline styles — use nativewind or `constants/Colors`
- ❌ Class components — use functions + hooks
- ❌ Direct `axios` — always use `ApiContext`
- ❌ `console.log` in production code — use a logger utility
- ❌ Magic numbers/strings — use `constants/` or `config/`
- ❌ Storing JWTs in `AsyncStorage` directly — use `SecureStore` or context
