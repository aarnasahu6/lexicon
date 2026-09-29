# Lexicon — local edition

A local React Native / Expo app for finance and business fluency. No sign-in, API key, backend, subscription, or paid AI service. All learning content and fonts are bundled with the app. Preferences, saved vocabulary, learned status, and the latest 100 activities stay on the device.

The final implementation follows the request to remove accounts and paid AI. Supabase and the server integration have been removed.

## Run on your phone

Use Node.js 22 or later and pnpm. From this folder:

```sh
pnpm install
pnpm start
```

Open the project in a compatible Expo Go app using the displayed QR code, or use a development build. This project uses Expo SDK 55. Your phone and development computer should be on the same network for the initial development connection. Expo Go compatibility depends on the installed Expo Go version; an SDK 55 development build is the reliable alternative.

```sh
pnpm ios       # requires the iOS simulator / Xcode
pnpm android   # requires an Android emulator or connected device
pnpm web       # browser development preview
```

The mobile app's bundled content and local storage work without a network after installation. A development session still needs its development server to initially load the JavaScript. No environment variables are required.

If Metro reports too many file watchers on macOS, install Watchman or use the included production web preview:

```sh
pnpm export:web
pnpm preview
```

Open http://localhost:8081. This is a local browser preview of the same React Native app, not an app-store installation. The project does not include a signed APK or IPA.

## What works

- Onboarding: language, career stage, and field, saved locally.
- Home: Bridge, Understand, Scan, Learn, and recent activity.
- Bridge: six curated scenarios in English, Spanish, and natural Hinglish: rising costs, paying bills, new investors, buying equipment, borrowing to grow, and cash tied up in inventory.
- Understand: one financial-report scenario demonstrating 150 basis points, plus glossary lookup in pasted text, including common Spanish synonyms.
- 22 finance terms with definitions, localized explanations, and usage examples.
- Saving terms, marking them learned, search, and flashcards.
- Scan: native camera/photo selection, manual text entry, and an explicitly labeled sample document routed to Understand.
- Settings: learning preferences and a plain explanation of local data storage.

## Limits, stated plainly

This is an offline educational app, not a generative AI model. It recognizes included scenarios and finance terms. A glossary match returns definitions and usage examples; it does not claim to interpret the full sentence. Unrecognized input prompts the user to choose a supported scenario or term. It does not fabricate a new rewrite.

OCR is not implemented. Selecting a photo does not extract text; the screen clearly asks the user to paste/type text or load the sample. There are no mocked server calls or hidden paid services.

Preferences personalize language and context labels; this first content pack covers finance/business for all career stages. Specialized accounting or consulting content and adaptive difficulty are not implemented.

Saved explanations retain the language used when saved. Device data is not synced or backed up. Clearing storage or uninstalling can remove progress. Downloadable packs are a future extension, not an existing feature.

## Architecture

```text
src/app/                Expo Router screens and bottom navigation
src/components/         Shared controls, palette, and explanation workspace
src/data/terms.ts       Bundled trilingual finance glossary
src/data/types.ts       TypeScript types and runtime validation
src/services/offline.ts Local scenario matching and glossary lookup
src/services/storage.ts LocalRepository interface + AsyncStorage adapter
src/state/AppState.tsx  App state and serialized durable writes
```

The storage interface can later be implemented with SQLite without changing screens. The initial seed-pack metadata lives in `src/data/terms.ts`. No offline neural model is included or required.

## Visual direction

Inspired by the corrected reference: https://lexicon-lingo-proto.lovable.app/

The site's OKLCH colors were inspected and converted to sRGB for native components: ivory `#FFFAEB`, blue `#11507D`, ink `#0C3859`, muted blue `#4B677E`, pale cream `#FFF3D5`, and warm accent `#F2DEAF`.

The app uses bundled Pinyon Script for the wordmark, Cormorant Garamond for headings, and DM Sans for readable controls. These are alternatives to the reference site's custom fonts.

## Verification

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm exec expo export --platform all
```

TypeScript, lint, and local content/validation tests pass. Web, iOS, and Android JavaScript bundle exports were checked. Bundle export is not a native-device or store-build test.

Automated access to the local browser preview was denied, so visual and interaction QA could not be completed. Camera permission behavior and persistence across native app restarts still need a physical-device check. No sign-in or live-service testing applies to this local-only version.

## Next steps

1. Test onboarding, scenario selection, saved terms, flashcards, and photo selection on physical iOS and Android devices.
2. Expand the reviewed offline scenario library based on student feedback.
3. Add on-device OCR and optional local backup/export if needed.
4. Create signed mobile builds when ready to distribute. Running the included content never requires an AI key.

Reference for the Expo Router project layout: https://docs.expo.dev/router/installation/
