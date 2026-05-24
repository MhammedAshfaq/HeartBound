# 🔄 Data Flow

## 📌 App-Level Flow

1. User opens app → Splash checks auth state
2. If not authenticated → Login screen
3. If new user → Onboarding (3 steps) → Preference Quiz
4. If returning → Home screen with daily suggestion
5. User logs mood, interacts with suggestions
6. Local Redux store tracks all interactions

---

## 🔁 Feedback Loop

User Action → Local State Update → UI Refresh → Better Suggestions

---

## 📊 Example

- User skips gift suggestions → preference weights shift locally
- User completes emotional messages → similar types prioritized
