# Google Classroom Integration Setup Guide

## Environment Variables

Add these to your `.env.local` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

For production:
```env
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/callback
```

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Classroom API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Classroom API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: **Web application**
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback` (development)
     - `https://yourdomain.com/api/auth/callback` (production)

5. Copy the Client ID and Client Secret to your `.env.local` file

## Required OAuth Scopes

The integration requests these scopes:
- `classroom.courses.readonly` - Read course information
- `classroom.coursework.me.readonly` - Read coursework assigned to the student
- `userinfo.email` - Access user email
- `userinfo.profile` - Access user profile

## Security Features

- ✅ Tokens stored in httpOnly cookies (not accessible via JavaScript)
- ✅ Secure flag enabled in production
- ✅ Automatic token refresh using refresh tokens
- ✅ Proper error handling and user feedback

## Usage

1. Click "Sign in with Google" button
2. Authorize the application
3. Click "Sync Progress" to fetch Classroom assignments
4. View progress with progress bar and completion badges
5. See assignment status (Turned In, Graded, Not Started)

## Mapping Concepts to Classroom

To link concepts to Classroom assignments, add these fields to your concept data:

```typescript
{
  id: 'concept-1',
  // ... other fields
  googleClassroomCourseId: '123456789', // Optional: specific course ID
}
```

If `googleClassroomCourseId` is provided, the sync will fetch assignments for that specific course. Otherwise, it fetches all courses.

