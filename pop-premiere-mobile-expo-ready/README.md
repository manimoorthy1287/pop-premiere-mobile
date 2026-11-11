# Pop Premiere mobile app

Expo Router starter connected to the existing Pop Premiere mobile API. It includes email/password sign-in, secure on-device token storage, token refresh, a home screen, account sign-out, and a read-only product list.

## Run it

1. Install Node.js LTS on your computer if it is not already installed.
2. In this folder, run `npm install`, then `npx expo install --fix` to align native package versions with the installed Expo SDK.
3. Start the development server with `npx expo start` and open it in Expo Go or a development build.
4. Sign in with an existing Pop Premiere owner account. The API is live only after the Lovable project has been published.

The app calls `https://shop-snapshot-sales-story.lovable.app/api/public/mobile/sign-in` and `/products`. Access and refresh tokens are stored using Expo SecureStore. No Supabase URL, publishable key, database password, or service-role key is embedded in this app. Product reads run through the authenticated mobile API and existing access rules.

Staff access may require an active shift started in the web app. The current API is read-only; this starter does not submit sales or change products, inventory, or staff records.
