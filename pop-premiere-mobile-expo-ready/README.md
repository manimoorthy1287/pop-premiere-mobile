# Pop Premiere mobile app

Expo Router app connected to the existing Pop Premiere mobile API. It includes email/password sign-in, password recovery, secure on-device token storage, token refresh, a home screen, account sign-out, and a read-only product list. Its colors, logo, and Barlow / Bebas Neue fonts follow the Lovable web app.

## Run it

1. Install Node.js LTS on your computer if it is not already installed.
2. In this folder, run `npm install`, then `npx expo install --fix` to align native package versions with the installed Expo SDK.
3. Start the development server with `npx expo start` and open it in Expo Go or a development build.
4. Sign in with an existing Pop Premiere account. If needed, tap **Forgot password?** and follow the emailed link to set a password.

The app calls `https://shop-snapshot-sales-story.lovable.app/api/public/mobile/sign-in`, `/password-recovery`, and `/products`. Access and refresh tokens are stored using Expo SecureStore. No Supabase URL, publishable key, database password, or service-role key is embedded in this app. Product reads run through the authenticated mobile API and existing access rules.

**Google sign-in:** the button opens the existing Pop Premiere web sign-in in the phone's browser, where Google sign-in is already enabled. It lets you view the complete web app, but it does not create a native-app session. The current Lovable-managed Google OAuth integration does not support the Expo callback needed for native Google sign-in. Use password recovery to set a password and then sign into this native app with email and password.

## Build from GitHub

Keep the Expo project's base directory set to `/pop-premiere-mobile-expo-ready`. For an Android APK, select the `preview` build profile and `Preview` environment, then turn off automatic store submission.

Staff access may require an active shift started in the web app. The current API is read-only; this starter does not submit sales or change products, inventory, or staff records.
