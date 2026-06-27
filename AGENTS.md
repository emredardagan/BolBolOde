# AGENTS.md

## Cursor Cloud specific instructions

BölBölÖde is an Expo (SDK 54) React Native app for shared-expense management, using Firebase for auth/data.

- Install: `npm install`. Type-check: `npx tsc --noEmit` (passes). Lint: `npm run lint`.
- Running the actual app requires a device/emulator (Android/iOS) or `expo start`; it cannot be exercised end-to-end headlessly in the cloud VM. Use type-check/lint for validation here.
- Firebase config is required at runtime via `EXPO_PUBLIC_FIREBASE_*` env vars (see README); without them auth/data features will not work.
