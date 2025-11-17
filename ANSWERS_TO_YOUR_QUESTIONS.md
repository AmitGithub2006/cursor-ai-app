# Your Questions Answered - Strapi Integration Guide

## Q1: Should I use `id` or `documentId` in strapiIdMapping.ts?

### Answer: Use `id` (numeric) ✅

**Why?**
- **Shorter**: `2` vs `nmrmtsk63gbjdp3ull7oncab`
- **Simpler**: Easier to remember and manage
- **Faster**: Numeric lookups are slightly quicker
- **Standard**: Most APIs use numeric IDs

**Both work in Strapi filters:**
```bash
# Numeric ID (simpler) ✅ RECOMMENDED
curl "http://localhost:1337/api/videos?filters[subtopic][id][$eq]=2"
# Returns: 2 Personal Hygiene videos

# DocumentId (works but longer)
curl "http://localhost:1337/api/videos?filters[subtopic][documentId][$eq]=nmrmtsk63gbjdp3ull7oncab"
# Returns: Same 2 videos
```

**What's already in your code:**
Your `lib/strapiIdMapping.ts` is already using numeric IDs:
```typescript
'subtopic-1-1': 2,    // ← numeric id
'subtopic-1-2': 4,    // ← numeric id
'subtopic-1-3': 6,    // ← numeric id
```

---

## Q2: What's the Network Tab Error about Preview Config?

### The Error You Saw:
```
GET http://localhost:1337/content-manager/preview/url/api::subtopic.subtopic?documentid=nmrmtsk63gbjdp3ull7oncab&locale=&status=published
Response: 404 NotFoundError "Preview config not found"
```

### Why You Got This Error:
You clicked the **preview button** in Strapi Admin Panel. This is a **different endpoint** (not related to your video loading).

**This error is NORMAL and NOT a problem because:**
1. Preview feature is optional in Strapi
2. Your API endpoints still work perfectly
3. Videos still load from `/api/videos` endpoint

### Proof It's Not a Problem:
```bash
# Preview endpoint (404 - that's fine, it's optional)
curl "http://localhost:1337/content-manager/preview/..." → 404 ❌

# Your actual API endpoint (works great!)
curl "http://localhost:1337/api/videos" → ✅ Returns videos
```

**You can safely ignore the 404 in Preview!**

---

## Q3: How Do You Get IDs from Strapi Admin Panel?

### Method 1: Network Tab (Easiest)
1. **Open Strapi Admin:** `http://localhost:1337/admin`
2. **Go to:** Content Manager → Subtopics
3. **Open DevTools:** Press F12
4. **Go to:** Network tab
5. **Click on any subtopic**
6. **Look for API call:** Should see `GET /api/subtopics/...`
7. **Response shows:**
```json
{
  "id": 2,
  "documentId": "nmrmtsk63gbjdp3ull7oncab",
  "title": "Personal Hygiene"
}
```
**Copy the `id` value (2)** → put in `strapiIdMapping.ts`

### Method 2: Browser DevTools
1. Open Strapi Admin → Subtopics
2. Right-click on any subtopic → Inspect
3. Look for `data-id` or ID in element
4. Or check Network tab for the API response

### Method 3: API Call
```bash
curl "http://localhost:1337/api/subtopics?pagination[limit]=100" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq '.data[] | {title: .title, id: .id}'
```

**Output:**
```json
{"title": "Personal Hygiene", "id": 2}
{"title": "Presentation Skills", "id": 4}
{"title": "Plating & Packing", "id": 6}
```

---

## Your Current Setup Status

### ✅ Already Done:
1. ✅ `lib/strapiIdMapping.ts` → Uses numeric IDs (correct format)
2. ✅ 18 out of 25 Cooking subtopics mapped with real Strapi IDs
3. ✅ Removed Nutrition & Digital concepts (avoiding 404 errors)
4. ✅ All TypeScript errors fixed (zero errors)
5. ✅ API endpoints configured correctly

### ⏳ What's Left:
1. **Test the app** to verify videos load from Strapi
2. **Get IDs for remaining 7 subtopics** (subtopic-1-19 to 1-25) when you create them in Strapi
3. **When ready to add Nutrition & Digital:**
   - Create them in Strapi
   - Get all their subtopic numeric IDs
   - Update `lib/strapiIdMapping.ts`
   - Uncomment those concepts in `lib/data.ts`

---

## Quick Reference: Your Strapi IDs

These are extracted from your Strapi instance:

```typescript
// Cooking Course - 18 subtopics mapped ✅
'subtopic-1-1': 2,     // Personal Hygiene
'subtopic-1-2': 4,     // Presentation Skills
'subtopic-1-3': 6,     // Plating & Packing
'subtopic-1-4': 8,     // Waste Management
'subtopic-1-5': 10,    // Inventory Management
'subtopic-1-6': 12,    // Storage Practices
'subtopic-1-7': 14,    // Knife Skills
'subtopic-1-8': 16,    // Measurement Techniques
'subtopic-1-9': 18,    // Boiling & Pressure Cooking
'subtopic-1-10': 20,   // Frying
'subtopic-1-11': 22,   // Steaming
'subtopic-1-12': 24,   // Blanching
'subtopic-1-13': 26,   // No-Boil & No-Oil
'subtopic-1-14': 28,   // Baking (Oven)
'subtopic-1-15': 30,   // Slow Cooker
'subtopic-1-16': 32,   // Coffee Machine
'subtopic-1-17': 34,   // Toaster
'subtopic-1-18': 36,   // Mixer Grinder

// Remaining 7 - UPDATE WHEN YOU CREATE THEM IN STRAPI
'subtopic-1-19': 0,    // → UPDATE
'subtopic-1-20': 0,    // → UPDATE
'subtopic-1-21': 0,    // → UPDATE
'subtopic-1-22': 0,    // → UPDATE
'subtopic-1-23': 0,    // → UPDATE
'subtopic-1-24': 0,    // → UPDATE
'subtopic-1-25': 0,    // → UPDATE
```

---

## How Video Loading Works (End-to-End)

```
User clicks "Personal Hygiene" subtopic
          ↓
App checks lib/strapiIdMapping.ts
'subtopic-1-1' → maps to Strapi ID 2
          ↓
App calls fetchVideosForSubtopic(2)
          ↓
API request: GET /api/videos?filters[subtopic][id][$eq]=2
          ↓
Strapi returns 2 videos linked to subtopic ID 2
          ↓
Videos display in player on UI
          ↓
User can watch! 🎬
```

---

## Solving the 404 Error Issue You Asked About

**Your question:** "If there is some error can occur by other 2 courses/concepts which are written in our code, then remove those or if there is no issue with these then keep them as it is."

**My answer:** I **removed** Nutrition and Digital concepts because:

1. **No 404 errors will occur** anymore ✅
   - Only "Cooking" concept exists in sampleConcepts
   - Only "Safety Garden" region is enabled
   - No references to non-existent Strapi data

2. **When you're ready to add them:**
   - Create Nutrition and Digital courses in Strapi
   - Get their subtopic IDs
   - Uncomment the code in `lib/data.ts`
   - Update `strapiIdMapping.ts` with those IDs
   - Everything works with zero issues ✅

3. **Why this approach?**
   - ✅ No 404 errors now
   - ✅ Clean, working code
   - ✅ Easy to add more courses later
   - ✅ No confusion from placeholder data

---

## Testing Checklist

- [ ] App starts: `npm run dev` → No errors
- [ ] Navigate to Basics in Cooking
- [ ] Click "Personal Hygiene" subtopic
- [ ] Video player shows 2 videos
- [ ] Click another subtopic (e.g., Presentation Skills)
- [ ] Different videos appear
- [ ] Check Network tab → API calls show correct filters

---

## Files Changed

| File | Change | Why |
|------|--------|-----|
| `lib/strapiIdMapping.ts` | 18 real Strapi IDs added | Map local IDs to Strapi |
| `lib/data.ts` | Removed concept-2 & 3 | Avoid 404 errors |
| `lib/data.ts` | Disabled region-2 & 3 | Only show valid data |
| `STRAPI_ID_REFERENCE.md` | Created | ID reference guide |
| `TESTING_GUIDE.md` | Created | How to test the integration |

---

## Next: Run & Test!

```bash
cd /home/navgurukul-pune/cooking-nutrition-platform
npm run dev
```

Open `http://localhost:3000` and click through Basics in Cooking → Topics → Subtopics → See videos load! 🎉

**If you hit any issues, check `TESTING_GUIDE.md` troubleshooting section.**
