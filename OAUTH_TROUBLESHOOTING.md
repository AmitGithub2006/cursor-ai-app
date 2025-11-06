# Troubleshooting Google OAuth 400 Error

## Common Causes and Solutions

### 1. **Redirect URI Mismatch** (Most Common)

The redirect URI must **exactly match** what's configured in Google Cloud Console.

**Check your setup:**

1. **In Google Cloud Console:**
   - Go to "APIs & Services" > "Credentials"
   - Click on your OAuth 2.0 Client ID
   - Check "Authorized redirect URIs"
   - Ensure one of these is listed:
     - `http://localhost:3000/api/auth/callback` (for development)
     - `https://yourdomain.com/api/auth/callback` (for production)

2. **In your `.env.local` file:**
   ```env
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
   ```

3. **Verify they match exactly:**
   - No trailing slashes
   - Same protocol (http vs https)
   - Same port (3000 vs others)
   - Exact path match

### 2. **Missing Environment Variables**

Ensure all required variables are set in `.env.local`:

```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

**Note:** Restart your dev server after adding/changing environment variables:
```bash
npm run dev
```

### 3. **OAuth Consent Screen Not Configured**

1. Go to "APIs & Services" > "OAuth consent screen"
2. Fill in required fields:
   - User Type (Internal or External)
   - App name
   - User support email
   - Developer contact email
3. Add scopes:
   - `classroom.courses.readonly`
   - `classroom.coursework.me.readonly`
   - `userinfo.email`
   - `userinfo.profile`
4. Save and continue

### 4. **Google Classroom API Not Enabled**

1. Go to "APIs & Services" > "Library"
2. Search for "Google Classroom API"
3. Click "Enable"

### 5. **Testing the Setup**

1. Check if environment variables are loaded:
   ```bash
   # In your terminal, verify:
   echo $GOOGLE_CLIENT_ID
   ```

2. Test the OAuth URL generation:
   - Open browser console
   - Click "Sign in with Google"
   - Check Network tab for `/api/auth/google` request
   - Verify the `authUrl` in the response
   - Copy the `redirectUri` from response
   - Compare with Google Cloud Console

3. Test redirect URI manually:
   - Copy the redirect URI from your `.env.local`
   - Try accessing it directly: `http://localhost:3000/api/auth/callback`
   - Should show an error (expected), but confirms route exists

### 6. **Common Mistakes**

❌ **WRONG:**
```env
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/
GOOGLE_REDIRECT_URI=https://localhost:3000/api/auth/callback
GOOGLE_REDIRECT_URI=http://localhost/api/auth/callback
```

✅ **CORRECT:**
```env
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

### 7. **Debug Steps**

1. **Check browser console** for errors
2. **Check Network tab**:
   - Look for `/api/auth/google` request
   - Check response status and body
   - Verify `authUrl` is generated correctly
3. **Check server logs**:
   - Look for errors in terminal where `npm run dev` is running
4. **Verify OAuth URL**:
   - Copy the `authUrl` from API response
   - Paste in browser
   - Check the exact error message from Google

### 8. **Quick Fix Checklist**

- [ ] `.env.local` file exists in project root
- [ ] All 3 environment variables are set
- [ ] No trailing spaces in env values
- [ ] Dev server restarted after adding env vars
- [ ] Redirect URI matches exactly in Google Cloud Console
- [ ] OAuth consent screen is configured
- [ ] Google Classroom API is enabled
- [ ] Using correct Client ID (not the Client Secret)

### Still Having Issues?

1. Double-check the redirect URI in Google's error page - it shows what URI was sent
2. Compare character-by-character with your config
3. Try creating a new OAuth 2.0 credential in Google Cloud Console
4. Ensure you're using the correct Google account (the one that created the project)

