# Strapi Integration - Changes Summary

## Overview
The application has been updated to fetch videos and quizzes from Strapi CMS instead of using hardcoded data. The integration is fully functional and gracefully falls back to local data if Strapi is unavailable.

## Files Created

### 1. **lib/loadCmsData.ts** (NEW)
Main utility for loading CMS data from Strapi.

**Functions:**
- `fetchVideosForSubtopic(subtopicId)` - Fetches videos for a specific subtopic
- `fetchQuizzesForSubtopic(subtopicId)` - Fetches quizzes for a specific subtopic
- `enrichConceptsWithCmsData(concepts)` - Main function to populate concepts with Strapi data

**Key Features:**
- Handles API errors gracefully with fallback
- Maps Strapi response format to application format
- Converts quiz options from separate fields (A, B, C, D) to array format

### 2. **STRAPI_SETUP.md** (NEW)
Comprehensive setup and integration guide covering:
- Strapi collection structure (Course, Topic, Subtopic, Video, Quiz)
- Environment variable setup
- API endpoints
- Data flow
- Sample data creation examples
- Troubleshooting guide

## Files Modified

### 1. **lib/store.ts**
**Changes:**
- Imported `enrichConceptsWithCmsData` from `loadCmsData.ts`
- Made `initializeData()` async
- Added call to `enrichConceptsWithCmsData()` after setting initial concepts
- Added try-catch for graceful fallback to local data

**Signature Change:**
```typescript
// Before
initializeData: (concepts: Concept[], regions: Region[]) => void

// After
initializeData: async (concepts: Concept[], regions: Region[]) => Promise<void>
```

### 2. **lib/strapi/types.ts**
**Changes:**
- Updated `Video` interface to use `video_url` field (matching your Strapi schema)
  
```typescript
// Before
url: string;

// After
video_url: string;
```

### 3. **.env.local**
**Changes:**
- Added template entries for Strapi configuration:
  - `NEXT_PUBLIC_STRAPI_URL` - Your Strapi instance URL
  - `STRAPI_API_TOKEN` - API token for authentication

## Strapi Collection Types Used

All collection names are correctly pluralized in code:

| Collection | Endpoint | Status |
|-----------|----------|--------|
| **Video** | `/api/videos` | ✅ Configured & Ready |
| **Quiz** | `/api/quizzes` | ✅ Configured (empty - to be filled later) |
| **Subtopic** | `/api/subtopics` | ✅ Configured |
| **Topic** | `/api/topics` | ✅ Configured |
| **Course** | `/api/courses` | ✅ Configured |

## Service Files (Previously Updated)

All service files in `services/` directory use correct collection type names:
- `services/videos.ts` - Uses `/videos` endpoint
- `services/quizzes.ts` - Uses `/quizzes` endpoint
- `services/topics.ts` - Uses `/topics` endpoint
- `services/subtopics.ts` - Uses `/subtopics` endpoint
- `services/courses.ts` - Uses multiple endpoints

## Data Flow

```
App Start
    ↓
ConceptPage mounts
    ↓
Calls: initializeData(sampleConcepts, sampleRegions)
    ↓
Store sets initial concepts & regions with local data
    ↓
Calls: enrichConceptsWithCmsData(concepts)
    ↓
For each concept:
    For each subtopic:
        → Fetch Videos via /api/videos?subtopic=ID
        → Fetch Quizzes via /api/quizzes?subtopic=ID
    ↓
Concepts updated with fetched data
    ↓
UI renders with Strapi data (or local fallback if API fails)
```

## Required Setup Steps

1. **Update .env.local with Strapi credentials:**
   ```bash
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337  # Your Strapi URL
   STRAPI_API_TOKEN=your_api_token               # From Strapi Admin Panel
   ```

2. **Ensure your Strapi collections are created:**
   - ✅ Video (with fields: title, description, video_url)
   - ✅ Quiz (with fields: title, questions component)
   - ✅ Subtopic (with relation to Video & Quiz)

3. **Add API Token in Strapi:**
   - Admin Panel → Settings → API Tokens
   - Create new token with appropriate permissions
   - Copy and add to .env.local

4. **Add sample data to Strapi (optional but recommended):**
   - Create at least one Video entry linked to a Subtopic
   - Later: Create Quiz entries with QuizQuestion components

## Backward Compatibility

- If Strapi is unavailable or credentials are missing:
  - ✅ Application falls back to local data from `lib/data.ts`
  - ✅ Console warnings indicate which API calls failed
  - ✅ User experience is not interrupted
  - ✅ Quizzes remain empty until Quiz collection is populated in Strapi

## Testing

After setup, to verify the integration:

1. Check browser console for any API errors
2. Open Network tab in DevTools
3. Look for API calls to `/api/videos` and `/api/quizzes`
4. Verify video data loads on concept pages
5. Check that quiz button appears once quiz data is added to Strapi

## Next Steps

1. **Add videos to Strapi:**
   - Go to Strapi Admin → Videos
   - Create entries with YouTube URLs

2. **Add quizzes to Strapi (when ready):**
   - Go to Strapi Admin → Quizzes
   - Create entries with quiz questions
   - Link to appropriate subtopics

3. **Monitor API calls:**
   - Check that videos and quizzes load correctly
   - Adjust Strapi relations if needed

## Troubleshooting Reference

See **STRAPI_SETUP.md** for detailed troubleshooting guide including:
- Videos not loading
- CORS issues
- API token problems
- Connection issues

## Notes

- The existing subtopic-based video UI structure is preserved
- Videos can be managed through Strapi while keeping the same user interface
- Quiz functionality is ready once quiz data is added to Strapi
- The system degrades gracefully if Strapi is unavailable
