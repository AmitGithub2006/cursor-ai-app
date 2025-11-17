# How to Fix the Video Fetching Issue

## Problem
Videos are not loading because the app uses string IDs (like "subtopic-1-1") but Strapi stores numeric IDs.

## Solution
Update the `lib/strapiIdMapping.ts` file with the correct Strapi numeric IDs.

## Steps to Get Strapi IDs

### Option 1: From Network Tab (Easiest)
1. Open Strapi Admin Panel
2. Go to **Content Manager → Subtopics**
3. Click on a subtopic (e.g., "Grooming")
4. Open browser **DevTools → Network tab**
5. Look for API call to `/api/subtopics`
6. Check the response - note the `id` field

Example response:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Grooming",
        ...
      }
    }
  ]
}
```

### Option 2: From Strapi Admin URL
1. Go to Strapi Admin Panel
2. Click on Content Manager → Subtopics
3. Click on "Grooming" subtopic
4. Look at the URL - it might show the ID like: `http://localhost:1337/admin/content-manager/collectionType/api::subtopic.subtopic/1`
5. The number `1` is the Strapi ID

### Option 3: Using API Directly
1. Open terminal and run:
   ```bash
   curl "http://localhost:1337/api/subtopics?populate=*" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```
2. Look for each subtopic and note its `id`

## Update the Mapping File

Edit `lib/strapiIdMapping.ts` and replace the IDs:

```typescript
export const strapiIdMapping: Record<string, number> = {
  // Concept 1 - Basics in Cooking
  'subtopic-1-1': 1,   // Grooming - REPLACE 1 with actual ID
  'subtopic-1-2': 2,   // SOP - REPLACE 2 with actual ID
  'subtopic-1-3': 3,   // Tools & Techniques - REPLACE 3 with actual ID
  'subtopic-1-4': 4,   // Cooking Methods - REPLACE 4 with actual ID
  'subtopic-1-5': 5,   // Appliances Training - REPLACE 5 with actual ID

  // Concept 2 - Basics in Nutrition
  'subtopic-2-1': 6,   // Macronutrients... - REPLACE 6 with actual ID
  'subtopic-2-2': 7,   // Lifestyle Nutrition - REPLACE 7 with actual ID
  'subtopic-2-3': 8,   // Food Allergies... - REPLACE 8 with actual ID
  'subtopic-2-4': 9,   // Dietary Preferences - REPLACE 9 with actual ID

  // Concept 3 - Digital Basics
  'subtopic-3-1': 10,  // Google Workspace - REPLACE 10 with actual ID
  'subtopic-3-2': 11,  // Productivity Tools - REPLACE 11 with actual ID
  'subtopic-3-3': 12,  // AI Tools - REPLACE 12 with actual ID
};
```

## Example: Getting IDs for All Subtopics

### Best Way: Use Strapi API
```bash
# Get all subtopics with their IDs
curl "http://localhost:1337/api/subtopics?pagination[limit]=100" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

Response:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Grooming"
      }
    },
    {
      "id": 2,
      "attributes": {
        "title": "Standard Operating Procedures (SOP)"
      }
    },
    // ... more subtopics
  ]
}
```

Then match the titles to the local IDs and update the mapping.

## Quick Checklist

- [ ] Get all Strapi subtopic IDs and titles
- [ ] Update `lib/strapiIdMapping.ts` with correct numeric IDs
- [ ] Save the file
- [ ] Refresh the browser
- [ ] Click on a subtopic (e.g., "Personal Hygiene")
- [ ] Verify videos load from Strapi
- [ ] Check Network tab - API should return videos

## After Updates

Once you update the IDs:
1. Save `lib/strapiIdMapping.ts`
2. The app will auto-reload (if using `npm run dev`)
3. Click on "Personal Hygiene" or any subtopic
4. Videos from Strapi should now load!

## Troubleshooting

**Still no videos?**
- ✅ Double-check the numeric IDs are correct
- ✅ Make sure videos are actually created in Strapi for that subtopic
- ✅ Check Network tab for API response - should show videos, not empty `[]`
- ✅ Verify STRAPI_API_TOKEN is correct in .env.local

**Wrong IDs causing 404 errors?**
- ✅ Use the API method above to get correct IDs
- ✅ Update the mapping and refresh browser

## Need Help?

1. Strapi Admin Panel → Content Manager → Subtopics
2. Click each subtopic and note the ID
3. Update lib/strapiIdMapping.ts
4. Refresh browser

That's it! Videos should load now. 🎬
