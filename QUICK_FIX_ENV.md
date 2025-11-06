# Quick Fix: Environment Variables Setup

## The Problem

Your `.env.local` file contains placeholder values like `your_google_client_id_here`. You need to replace these with your actual Google OAuth credentials.

## Step-by-Step Fix

### 1. Create/Update `.env.local` file

Create a file named `.env.local` in your project root (same directory as `package.json`) with:

```env
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET_HERE
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

### 2. Get Your Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to: **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback`
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### 3. Update `.env.local`

Replace the placeholders with your actual values:

```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

**Important:**
- Client ID should end with `.apps.googleusercontent.com`
- Client Secret should start with `GOCSPX-`
- No quotes around values
- No spaces around the `=` sign

### 4. Restart Your Dev Server

**CRITICAL:** After updating `.env.local`, you MUST restart your dev server:

1. Stop the server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### 5. Enable Google Classroom API

1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Classroom API"
3. Click **Enable**

### 6. Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Fill in required fields
3. Add scopes:
   - `classroom.courses.readonly`
   - `classroom.coursework.me.readonly`
   - `userinfo.email`
   - `userinfo.profile`
4. Save and continue

## Verify It's Working

After restarting, check:
1. Browser console should NOT show `your_google_client_id_here`
2. Click "Sign in with Google"
3. Should redirect to Google's login page (not show 400 error)

## Common Mistakes

❌ **Don't do this:**
```env
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_ID= your_google_client_id_here
GOOGLE_CLIENT_ID=your_google_client_id_here  # <- Still placeholder!
```

✅ **Do this:**
```env
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
```

## Still Not Working?

1. **Double-check** `.env.local` is in project root (not in a subfolder)
2. **Verify** no typos in variable names (`GOOGLE_CLIENT_ID` not `GOOGLE_CLIENTID`)
3. **Ensure** dev server was restarted after changes
4. **Check** terminal output for any environment variable warnings

