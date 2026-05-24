# 🏗️ Mobile App Architecture

## 📱 Framework
- React Native (Expo SDK 54)

## 🧭 Navigation
- @react-navigation/native-stack
- @react-navigation/bottom-tabs
- 5 tab screens: Home, Notifications, Gifts, Analytics, Profile

## 🗃️ State Management
- Redux Toolkit (6 slices: auth, user, quiz, mood, suggestion, partner)
- redux-persist + AsyncStorage for offline persistence

## 🧩 Component Architecture
- Common UI kit: Button, Card, Input, Modal, Loading
- Auth components: LoginForm, OTPInput
- Screen-scoped components per feature

## 🔔 Notifications (Local)
- expo-notifications for local scheduling
- Daily reminders, inactivity prompts, event reminders

---

## 📌 Current Stage

- UI Layer Completed
- Mock data layer in place for prototyping
- API integration layer ready (Axios service stubs)
