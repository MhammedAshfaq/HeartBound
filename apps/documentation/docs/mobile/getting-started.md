# Getting Started

## Prerequisites

- Node.js 20+
- pnpm (workspace root manages dependencies)
- iOS: Xcode 16+ (macOS only)
- Android: Android Studio + Android SDK

## Setup

```bash
# From monorepo root
cd apps/mobile
pnpm install
```

## Environment

Copy the example env file and fill in the values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_BACKEND_URL` | Backend API base URL |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (if used) |

## Running the App

```bash
# Start Expo dev server
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android

# Run on web
pnpm web
```

## Project Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `expo start` | Start Expo dev server |
| `ios` | `expo run:ios` | Run on iOS simulator |
| `android` | `expo run:android` | Run on Android emulator |
| `lint` | `eslint .` | Run ESLint |
| `type-check` | `tsc --noEmit` | Run TypeScript type checking |
| `format` | `prettier --write .` | Format code with Prettier |

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based routing |
| `nativewind` | Tailwind CSS for React Native |
| `gluestack-ui` | UI component library |
| `i18next` + `react-i18next` | Internationalization |
| `expo-localization` | Device locale detection |
| `react-native-reanimated` | Animations |
| `expo-font` | Custom font loading |
| `@expo/vector-icons` | Icon set |

## Project Structure Overview

```
apps/mobile/
├── app/              # Routes (Expo Router)
├── components/       # Reusable components
│   ├── ui/           # gluestack-ui primitives
│   └── common/       # Shared app components
├── contexts/         # React Context providers
├── hooks/            # Custom hooks
├── constants/        # Colors, Enums, etc.
├── lib/              # Utilities & i18n
├── config/           # App configuration
├── localization/     # Translation files
└── assets/           # Images & fonts
```

## Development workflow

1. Create a route in `app/` for a new screen
2. Build UI with gluestack-ui components + nativewind classes
3. Add translations in `localization/<lang>.ts`
4. Wire API calls through `useApi()` hook
5. Add state via contexts (global) or hooks (local)
