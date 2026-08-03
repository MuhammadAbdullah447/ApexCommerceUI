# Apex Commerce UI

A React Native e-commerce mobile app UI, built with **React Native CLI** and **TypeScript**. This project recreates a full 6-screen shopping app experience — Splash, Login, Home, Product List, Product Details, and Profile — including light/dark theming, local search and filtering, favorites, and a fully custom design system.

This project is a **learning/internship project**: all product and user data is local dummy data, there is no backend, and there is no real authentication. It is intentionally built using only foundational React Native and TypeScript concepts (no navigation library, no state management library, no backend) as part of a structured, syllabus-driven mobile development curriculum.

---

## Features

- **Splash Screen** — branded launch screen with an auto-timed transition to Login
- **Login Screen** — email/password form with local validation, social login UI (Google/Apple), password visibility toggle
- **Home Screen** — personalized greeting, live search, category filtering, promotional banner, New Arrivals and Popular Products grids
- **Product List Screen** — full catalogue browsing with search, category filters, and a cycling sort control (price low→high / high→low)
- **Product Details Screen** — swipeable image gallery, star ratings, expandable description, color/size selection, quantity stepper, related products, Add to Cart / Buy Now
- **Profile Screen** — user info, account menu, and a working **Dark Mode toggle** that re-themes the entire app
- **System-aware Dark Mode** — the app matches your device's system theme on launch, and follows live system theme changes until you manually override it with the in-app toggle
- **Favorites** — tap the heart on any product to favorite/unfavorite it, synced consistently across every screen
- **Fully local state** — no backend, no persistence; all data lives in local arrays and resets on app restart

---

## Tech Stack

- **React Native** — bare CLI (`@react-native-community/cli`), **not** Expo
- **TypeScript**
- **react-native-vector-icons** (`MaterialIcons` + `MaterialCommunityIcons`) — the only third-party package used

No navigation library, no state management library (Redux/Context/Zustand), no HTTP client, no storage library, and no animation library are used in this project — everything is built with React's core `useState`/`useEffect` and React Native's built-in components.

---

## Project Structure

```
ApexCommerceUI/
├── android/                  Native Android project
├── ios/                      Native iOS project
├── src/
│   ├── assets/                Reserved for local images/fonts (currently uses remote placeholder images)
│   ├── components/            Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CategoryChip.tsx
│   │   ├── SectionTitle.tsx
│   │   └── BottomNavBar.tsx
│   ├── constants/              Design system
│   │   ├── theme.ts             Colors (light + dark), spacing, radius, status bar height
│   │   └── typography.ts        Text style scale
│   └── screens/                 One file per app screen
│       ├── SplashScreen.tsx
│       ├── LoginScreen.tsx
│       ├── HomeScreen.tsx
│       ├── ProductListScreen.tsx
│       ├── ProductDetailsScreen.tsx
│       └── ProfileScreen.tsx
├── App.tsx                    Root component — owns navigation state, favorites, and dark mode
├── index.js
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- A configured Android development environment (Android Studio, Android SDK, `ANDROID_HOME` set up) — see React Native's [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide, **Android → React Native CLI** tab
- A physical Android device with **USB debugging enabled**, or an Android emulator

This project has been developed and tested on a **physical Android device** via USB debugging. iOS has not been tested.

### Install dependencies

```bash
npm install
```

### Link vector icon fonts (Android)

This project uses `react-native-vector-icons`, which requires one manual native step on Android. Confirm the following line is present at the bottom of `android/app/build.gradle`:

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

(This should already be committed to the repo — only relevant if setting up a fresh clone shows missing icons.)

### Run the app

**1. Start Metro (the JS bundler)** — in one terminal:

```bash
npx react-native start
```

**2. Connect your Android device**, then in a second terminal, verify it's detected:

```bash
adb devices
```

**3. Build and install the app:**

```bash
npx react-native run-android
```

The app should build and launch automatically on your connected device.

### Making changes

Edit any file inside `src/` or `App.tsx` and save — [Fast Refresh](https://reactnative.dev/docs/fast-refresh) will update the running app automatically. If something looks out of sync after a native or config change, force a full reload: press **R twice** on your device, or open the Dev Menu (`Ctrl+M` / `Cmd+M`) and select **Reload**.

---

## Design System

All colors, spacing, border radius, and typography are centralized in `src/constants/theme.ts` and `src/constants/typography.ts`. Every screen and component reads from these shared tokens rather than hardcoding values, and accepts a `colors` prop so it automatically re-themes between light and dark mode.

---

## Project Constraints

This project intentionally avoids the following, as part of its structured learning scope:

- No React Navigation / Expo Router — screen switching is handled manually via local state in `App.tsx`
- No Redux, Context API, Zustand, or any global state library
- No AsyncStorage or any persistent storage — state resets on app restart
- No backend, REST APIs, or Axios — all data is local, hardcoded TypeScript arrays
- No animation libraries (`Animated`, Reanimated, Lottie) — all UI is static
- No advanced hooks (`useMemo`, `useCallback`, `useRef`, `useReducer`, `useContext`) — only `useState` and `useEffect` are used

These constraints will be lifted in future development phases (navigation, forms, backend integration).

---

## Known Limitations

- Product descriptions and review counts are placeholder text for most products (only the default/demo product has fully unique detail content)
- "Related Products" on the Product Details screen is a static list, not dynamically related to the viewed product
- Cart and Wishlist bottom-navigation tabs are present in the UI but not yet functional — there are no dedicated Cart/Wishlist screens
- No custom fonts are loaded — the app uses each platform's system default font