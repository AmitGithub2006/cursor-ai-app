# ✅ Testing Guide - Cooking Course Integration

## Summary of Changes Made

### 1. **ID Mapping Updated** ✅
- Updated `lib/strapiIdMapping.ts` with all 18 known Strapi numeric IDs for Cooking course
- Remaining 7 subtopics (subtopic-1-19 to subtopic-1-25) have placeholder value `0` - update when you add more videos/quizzes

### 2. **Removed Unused Concepts** ✅
- Removed "Basics in Nutrition" (concept-2) from `lib/data.ts`
- Removed "Digital Basics" (concept-3) from `lib/data.ts`  
- Disabled region-2 and region-3 that reference them
- **Result:** Only "Basics in Cooking" concept is active now

### 3. **Both ID Types Work** ✅
- Tested that both numeric `id` (2) and `documentId` (nmrmtsk63gbjdp3ull7oncab) work in Strapi filters
- **Recommendation:** Use numeric `id` (it's shorter and simpler)
- **Your mapping uses:** Numeric IDs (2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36)

---

## Current ID Mapping Status

### ✅ Mapped Subtopics (18 out of 25)

| Topic | Subtopic ID | Title | Strapi ID |
|-------|-----------|-------|-----------|
| Grooming | subtopic-1-1 | Personal Hygiene | **2** |
| | subtopic-1-2 | Presentation Skills | **4** |
| | subtopic-1-3 | Plating & Packing | **6** |
| SOP | subtopic-1-4 | Waste Management | **8** |
| | subtopic-1-5 | Inventory Management | **10** |
| | subtopic-1-6 | Storage Practices | **12** |
| Tools & Techniques | subtopic-1-7 | Knife Skills | **14** |
| | subtopic-1-8 | Measurement Techniques | **16** |
| Cooking Methods | subtopic-1-9 | Boiling & Pressure Cooking | **18** |
| | subtopic-1-10 | Frying | **20** |
| | subtopic-1-11 | Steaming | **22** |
| | subtopic-1-12 | Blanching | **24** |
| | subtopic-1-13 | No-Boil & No-Oil Cooking | **26** |
| | subtopic-1-14 | Baking (Oven) | **28** |
| | subtopic-1-15 | Slow Cooker | **30** |
| | subtopic-1-16 | Coffee Machine | **32** |
| | subtopic-1-17 | Toaster | **34** |
| | subtopic-1-18 | Mixer Grinder | **36** |

### ⏳ Unmapped Subtopics (7 out of 25)

| Subtopic ID | Status | Action |
|-----------|--------|--------|
| subtopic-1-19 to subtopic-1-25 | Placeholder (value 0) | Update when you create more subtopics in Strapi |

---

## How to Test

### Step 1: Start Your App
```bash
npm run dev
```

App should start at `http://localhost:3000` with **zero errors**.

### Step 2: Navigate to "Basics in Cooking"
1. Open `http://localhost:3000`
2. You should see "Safety Garden" (the only region now)
3. Click on "Basics in Cooking" concept

### Step 3: Test Video Loading
1. The sidebar should show **Grooming** topic with 3 subtopics
2. Click on **Grooming** to expand it
3. Click on **"Personal Hygiene"** subtopic
4. Check Network tab in DevTools:
   - Should see API call to: `http://localhost:1337/api/videos?populate=*&filters[subtopic][id][$eq]=2`
   - Should return 2 videos (you created 2 videos for Personal Hygiene in Strapi)
5. Videos should display in the player

### Step 4: Test Other Subtopics
Try clicking on other subtopics:
- First expand the **Grooming** topic
- Then click on "Presentation Skills" (id=4) → should show its videos
- Then click on "Plating & Packing" (id=6) → should show its videos

Or try other topics:
- Expand **SOP** topic
- Click on "Waste Management" → videos load
- etc.

---

## API Filter Format Reference

The app uses this exact Strapi filter format:

```
/api/videos?populate=*&filters[subtopic][id][$eq]=2
```

**Breakdown:**
- `populate=*` → Include all relations
- `filters[subtopic][id][$eq]=2` → Filter videos where subtopic.id = 2

---

## Adding Missing Subtopics Later

When you add more subtopics in Strapi (subtopic-1-19 to subtopic-1-25):

1. Get their numeric IDs from Strapi
2. Update `lib/strapiIdMapping.ts`:
```typescript
'subtopic-1-19': <NEW_ID>,  // e.g., 38
'subtopic-1-20': <NEW_ID>,  // e.g., 40
// etc.
```

3. Verify in DevTools Network tab that videos load

---

## When Nutrition & Digital Courses Are Ready

1. Create the courses/topics/subtopics in Strapi
2. Get all their Strapi numeric IDs
3. Update `lib/strapiIdMapping.ts` with all IDs
4. Uncomment the concepts in `lib/data.ts`:

```typescript
// Uncomment concept-2 and concept-3
```

5. Uncomment regions in `lib/data.ts`:

```typescript
// Uncomment region-2 and region-3
```

---

## Troubleshooting

### No videos appear when clicking subtopic

**Check:**
1. DevTools Network tab → API call status (should be 200, not 404)
2. Are videos linked to the correct subtopic in Strapi?
3. Is the subtopic ID correct in `lib/strapiIdMapping.ts`?

**Solution:**
```bash
# Test API directly
curl "http://localhost:1337/api/videos?filters[subtopic][id][$eq]=2"
# Should return your 2 Personal Hygiene videos
```

### TypeScript Errors

**Run:**
```bash
npm run build
```

If errors appear, file was not properly formatted. Check JSON/TypeScript syntax in `lib/strapiIdMapping.ts`.

### App won't start

Check console for errors. Most likely:
1. Syntax error in `lib/strapiIdMapping.ts` or `lib/data.ts`
2. Missing Strapi API token in `.env.local`

---

## Files Modified

| File | Changes |
|------|---------|
| `lib/strapiIdMapping.ts` | Updated 18 numeric IDs for Cooking subtopics |
| `lib/data.ts` | Removed Nutrition & Digital concepts, kept only Cooking |
| `STRAPI_ID_REFERENCE.md` | Created with ID reference guide |

---

## Next Steps

1. ✅ Test current setup with 25 Cooking subtopics (18 mapped, 7 placeholder)
2. ✅ Verify videos load from Strapi
3. ⏳ When ready, create Nutrition course in Strapi and add its subtopic IDs
4. ⏳ When ready, create Digital course in Strapi and add its subtopic IDs

---

## Questions?

- **API not responding?** Check if Strapi is running at `http://localhost:1337`
- **Videos not loading?** Verify Strapi token in `.env.local` is correct
- **Want different IDs?** Ask Strapi admin for numeric IDs of each subtopic

**Happy testing! 🎬**
