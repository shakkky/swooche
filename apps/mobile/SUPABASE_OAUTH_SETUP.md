# Supabase Google OAuth Setup for Mobile App

This guide explains how to configure Google OAuth in your Supabase project to enable "Continue with Google" authentication in the mobile app.

## Prerequisites

1. A Supabase project (already configured)
2. A Google Cloud Console project
3. The mobile app configured with the correct Supabase URL and keys

## Step 1: Configure Google OAuth in Google Cloud Console

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

### 1.2 Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Swooche"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email addresses for testing)

### 1.3 Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `https://bvyvuajzkofjrzxnoowq.supabase.co/auth/v1/callback`
   - `swooche://auth/callback` (for mobile app)
5. Note down the Client ID and Client Secret

## Step 2: Configure Supabase Authentication

### 2.1 Enable Google Provider

1. Go to your Supabase dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" and click "Enable"
4. Enter the Google OAuth credentials:
   - Client ID: Your Google OAuth Client ID
   - Client Secret: Your Google OAuth Client Secret
5. Save the configuration

### 2.2 Configure Redirect URLs

In your Supabase dashboard, go to "Authentication" > "URL Configuration" and add:

- Site URL: `https://bvyvuajzkofjrzxnoowq.supabase.co`
- Redirect URLs:
  - `https://bvyvuajzkofjrzxnoowq.supabase.co/auth/v1/callback`
  - `swooche://auth/callback`
  - `http://localhost:3000/auth/callback` (for development)

## Step 3: Test the Integration

### 3.1 Test in Development

1. Start the mobile app: `pnpm start`
2. Navigate to the login screen
3. Tap "Continue with Google"
4. Complete the OAuth flow
5. Verify you're redirected back to the app and logged in

### 3.2 Test in Production

1. Build the app: `pnpm build:apk` or `pnpm build:ios`
2. Install on a device
3. Test the Google sign-in flow

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**

   - Check that the redirect URI in Google Cloud Console matches exactly
   - Ensure the scheme `swooche://` is properly configured

2. **"OAuth consent screen not configured"**

   - Make sure you've completed the OAuth consent screen setup
   - Add your email as a test user

3. **"Client ID not found"**

   - Verify the Client ID and Client Secret are correct in Supabase
   - Check that the Google OAuth credentials are for a "Web application"

4. **Mobile app not receiving callback**
   - Ensure the `expo-auth-session` plugin is configured in `app.json`
   - Check that the scheme `swooche` is properly set up

### Debug Steps

1. Check Supabase logs in the dashboard
2. Check Google Cloud Console logs
3. Use console.log statements in the mobile app to debug the flow
4. Verify the OAuth callback URL is being called

## Security Considerations

1. **Client Secret**: Never expose the client secret in client-side code
2. **Redirect URIs**: Only add necessary redirect URIs to prevent unauthorized redirects
3. **OAuth Consent**: Configure the consent screen properly to inform users about data access
4. **HTTPS**: Always use HTTPS in production

## Next Steps

After successful OAuth setup:

1. Test user registration and login flow
2. Verify user data is being stored in Supabase
3. Test the integration with your backend API
4. Implement user profile management
5. Add additional OAuth providers if needed (GitHub, Microsoft, etc.)

## Configuration Files

The following files have been configured for OAuth:

- `app.json`: Added `expo-auth-session` plugin
- `src/lib/supabase.ts`: Supabase client configuration
- `src/contexts/AuthContext.tsx`: OAuth authentication logic
- `app/auth/callback.tsx`: OAuth callback handler
- `app/login.tsx`: Google sign-in button
