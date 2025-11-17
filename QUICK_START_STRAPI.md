# Quick Start - Strapi Integration

## What Changed?

The app now fetches **videos and quizzes from Strapi CMS** instead of hardcoded data.

## Before You Run the App

### Step 1: Update .env.local
```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token_from_strapi
```

### Step 2: Get API Token from Strapi
1. Login to Strapi Admin Panel (usually http://localhost:1337/admin)
2. Go to **Settings** → **API Tokens**
3. Click **Create new API Token**
4. Set appropriate permissions
5. Copy the token and paste into .env.local

### Step 3: Verify Strapi Collections Exist
✅ Video
✅ Quiz
✅ Subtopic
✅ Topic
✅ Course

## How It Works

1. **App starts** → Loads local sample data
2. **App initializes** → Fetches videos/quizzes from Strapi
3. **Videos display** → From Strapi if available, local fallback if not
4. **Quizzes** → Will work once you add quiz entries to Strapi

## Collection Structure

### Video Collection (Required)
- `title` - Video name
- `description` - Video description
- `video_url` - YouTube URL
- `subtopic` - Link to Subtopic (manyToOne relation)

### Quiz Collection (Set up later)
- `title` - Quiz name
- `questions` - Repeatable component with:
  - `question` - Question text
  - `optionA`, `optionB`, `optionC`, `optionD` - Answer options
  - `correctOption` - Correct answer (A, B, C, or D)
  - `explanation` - (Optional) Explanation
- `subtopic` - Link to Subtopic (manyToOne relation)

## Testing

```bash
npm run dev
```

Then:
1. Open browser → http://localhost:3000
2. Open DevTools → Network tab
3. Click through to a concept
4. Look for API calls to `/api/videos` and `/api/quizzes`
5. Videos should load from Strapi

## Fallback Behavior

If Strapi is down or not configured:
- ✅ App still works with local sample data
- ✅ Console shows warnings
- ✅ No errors shown to user

## Adding Sample Videos

1. Go to Strapi Admin → Videos collection
2. Click **Create new entry**
3. Fill in:
   - Title: "Kitchen Safety Basics"
   - Description: "Learn about kitchen safety"
   - video_url: "https://youtu.be/50q8wD6MXgI"
   - Subtopic: Select one (e.g., "Grooming")
4. Save

## Files Modified

| File | Changes |
|------|---------|
| **lib/loadCmsData.ts** | ✨ NEW - Main CMS loader |
| **lib/store.ts** | Updated - Now async, calls CMS loader |
| **lib/strapi/types.ts** | Updated - Video.video_url field |
| **.env.local** | Updated - Added Strapi config |
| **STRAPI_SETUP.md** | ✨ NEW - Full setup guide |
| **STRAPI_INTEGRATION_CHANGES.md** | ✨ NEW - Detailed changes |

## Documentation

- **STRAPI_SETUP.md** - Complete setup guide with troubleshooting
- **STRAPI_INTEGRATION_CHANGES.md** - Detailed technical changes

## Common Issues

**Q: Videos not loading?**
- ✅ Check .env.local has correct Strapi URL and token
- ✅ Verify Strapi is running
- ✅ Check DevTools Network tab for API errors
- ✅ Ensure Video entries exist in Strapi

**Q: "Quiz button" not appearing?**
- Expected! Quiz collection is empty (to be added later)
- Will work once you add quiz entries to Strapi

**Q: CORS error?**
- In Strapi: Settings → Server → Middlewares → CORS
- Allow your Next.js origin (http://localhost:3000)

## Next Steps

1. ✅ Update .env.local
2. ✅ Get API token from Strapi
3. ✅ Run `npm run dev`
4. ✅ Add sample videos to Strapi (optional)
5. Later: Add quizzes to Strapi

Happy coding! 🚀
