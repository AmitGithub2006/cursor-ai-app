# Strapi CMS Integration Setup Guide

## Overview
This guide explains how to set up Strapi to work with the Cooking & Nutrition Platform. The platform will fetch videos and quizzes from Strapi CMS.

## Strapi Collection Structure

Your Strapi instance should have the following collection types already configured:

### 1. **Course** (Collection Type)
- Fields: `title` (string), `description` (text), and relation to Topics
- Purpose: Top-level course container

### 2. **Topic** (Collection Type)
- Fields: `title` (string), `description` (text)
- Relations: 
  - `course` (manyToOne with Course)
- Purpose: Organize content into topics

### 3. **Subtopic** (Collection Type)
- Fields: `title` (string), `description` (text)
- Relations:
  - `topic` (manyToOne with Topic)
- Purpose: Organize topics into subtopics

### 4. **Video** (Collection Type) ✅
- **Already created by you**
- Fields:
  - `title` (string)
  - `description` (string)
  - `video_url` (string) - URL to YouTube video
  - `subtopic` (Relation manyToOne with Subtopic)
- Purpose: Store video content linked to subtopics

### 5. **Quiz** (Collection Type) ✅
- **Already created by you (but no entries yet)**
- Fields:
  - `title` (string)
  - `questions` (Repeatable Component - QuizQuestion)
    - Each question should have: `question`, `optionA`, `optionB`, `optionC`, `optionD`, `correctOption`
  - `subtopic` (Relation manyToOne with Subtopic)
- Purpose: Store quiz questions linked to subtopics
- Status: No entries created yet (will be added later)

## Setting Up Environment Variables

Update `.env.local` with your Strapi configuration:

```bash
# Strapi CMS Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337  # or your production Strapi URL
STRAPI_API_TOKEN=your_api_token_here          # API token from Strapi
```

### How to Get STRAPI_API_TOKEN:
1. Log in to Strapi Admin Panel
2. Go to **Settings** → **API Tokens**
3. Create a new API Token with appropriate permissions
4. Copy the token and add to `.env.local`

## API Endpoints Used

The platform uses the following Strapi endpoints:

- `GET /api/videos` - Fetch all videos (with filters for subtopic)
- `GET /api/quizzes` - Fetch all quizzes (with filters for subtopic)
- `GET /api/subtopics` - Fetch subtopics (with filters for topic)
- `GET /api/topics` - Fetch topics (with filters for course)
- `GET /api/courses` - Fetch all courses

### Query Parameters
- `populate=*` - Fetch nested relations
- `filters[subtopic][id][$eq]=ID` - Filter by subtopic ID
- `filters[topic][id][$eq]=ID` - Filter by topic ID
- `filters[course][id][$eq]=ID` - Filter by course ID

## Code Integration

### Main Entry Points

#### 1. **lib/loadCmsData.ts** (NEW)
- `enrichConceptsWithCmsData(concepts)` - Main function that enriches local concepts with Strapi data
- `fetchVideosForSubtopic(subtopicId)` - Fetches videos for a subtopic
- `fetchQuizzesForSubtopic(subtopicId)` - Fetches quizzes for a subtopic

#### 2. **lib/store.ts** (UPDATED)
- `initializeData()` is now async
- Calls `enrichConceptsWithCmsData()` to populate videos and quizzes
- Falls back to local data if Strapi is unavailable

#### 3. **services/videos.ts**
- `getVideos(params)` - Fetches videos from Strapi

#### 4. **services/quizzes.ts**
- `getQuizzes(params)` - Fetches quizzes from Strapi (ready for when quizzes are added)

## Data Flow

```
1. User lands on ConceptPage
   ↓
2. ConceptPage calls useStore().initializeData(sampleConcepts, sampleRegions)
   ↓
3. Store initializes with local data and calls enrichConceptsWithCmsData()
   ↓
4. For each concept's subtopic:
   - Fetch Videos from Strapi API (/api/videos?subtopic=ID)
   - Fetch Quizzes from Strapi API (/api/quizzes?subtopic=ID)
   ↓
5. Concepts updated with fetched videos and quizzes
   ↓
6. UI renders with Strapi data (or local fallback if API fails)
```

## Sample Data Creation

### Example: Adding Videos to Strapi

1. In Strapi Admin Panel → Videos Collection
2. Create a new entry:
   - Title: "Kitchen Safety Basics"
   - Description: "Learn about kitchen safety fundamentals"
   - video_url: "https://youtu.be/50q8wD6MXgI"
   - Subtopic: Select a subtopic (e.g., "Grooming")

### Example: Adding Quizzes to Strapi (Later)

1. In Strapi Admin Panel → Quiz Collection
2. Create a new entry:
   - Title: "Kitchen Safety Quiz"
   - Questions (add multiple):
     - Question: "What is the first step in food safety?"
     - Options: A) Wash hands, B) Get utensils, C) Turn on oven, D) Grab food
     - Correct Option: A
   - Subtopic: Select the same subtopic as the videos

## Fallback Behavior

If Strapi is unavailable or returns no data:
- The platform will use the local sample data from `lib/data.ts`
- Quizzes will remain empty until data is added to Strapi
- Console warnings will indicate which API calls failed

## Testing the Integration

1. **Ensure .env.local is set correctly**
   ```bash
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   STRAPI_API_TOKEN=your_token
   ```

2. **Start the application**
   ```bash
   npm run dev
   ```

3. **Open browser console** to check for:
   - API request logs (in Network tab)
   - Console warnings if Strapi is unavailable
   - Loaded video/quiz data

4. **Navigate to a concept** to see if videos are loading from Strapi

## Troubleshooting

### Videos Not Loading?
- ✅ Verify `NEXT_PUBLIC_STRAPI_URL` and `STRAPI_API_TOKEN` are set
- ✅ Check if Strapi is running on the correct port
- ✅ Verify Video entries exist in Strapi with proper subtopic relations
- ✅ Check browser console for API errors

### Quizzes Show "Take Quiz" Button But Empty?
- ✅ Quiz collection is set up but has no entries yet
- ✅ Quizzes will work once entries are added to Strapi
- ✅ Expected behavior until you create quiz entries

### CORS Issues?
- ✅ Ensure Strapi CORS settings allow your Next.js app origin
- ✅ In Strapi: Settings → Server → Middlewares → CORS

## Future Enhancements

- Add video watch tracking to Strapi
- Store quiz scores in Strapi
- Admin panel for managing videos/quizzes
- Bulk import from CSV to Strapi
