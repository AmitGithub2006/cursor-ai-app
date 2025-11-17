# Strapi ID Reference - Extracted from Your Instance

## Quick Answer: Use Numeric `id` NOT `documentId`

✅ **Use: `2` (numeric ID)**  
❌ **Don't use: `nmrmtsk63gbjdp3ull7oncab` (documentId)**

Both work in filters, but numeric ID is shorter and simpler.

---

## All Subtopics from Your Strapi Instance

Based on extraction from `http://localhost:1337/api/subtopics`:

### Cooking Course Subtopics (25 total)

| Local ID | Title | Strapi ID |
|----------|-------|-----------|
| subtopic-1-1 | Personal Hygiene | **2** |
| subtopic-1-2 | Presentation Skills | **4** |
| subtopic-1-3 | Plating & Packing | **6** |
| subtopic-1-4 | Waste Management | **8** |
| subtopic-1-5 | Inventory Management | **10** |
| subtopic-1-6 | Storage Practices | **12** |
| subtopic-1-7 | Knife Skills | **14** |
| subtopic-1-8 | Measurement Techniques | **16** |
| subtopic-1-9 | Boiling and Pressure Cooking | **18** |
| subtopic-1-10 | Frying | **20** |
| subtopic-1-11 | Steaming | **22** |
| subtopic-1-12 | Blanching | **24** |
| subtopic-1-13 | No-Boil & No-Oil Cooking | **26** |
| subtopic-1-14 | Baking (Oven) | **28** |
| subtopic-1-15 | Slow Cooker | **30** |
| subtopic-1-16 | Coffee Machine | **32** |
| subtopic-1-17 | Toaster | **34** |
| subtopic-1-18 | Mixer Grinder | **36** |
| subtopic-1-19 | (Continue checking Strapi...) | *pending* |
| subtopic-1-20 | (Continue checking Strapi...) | *pending* |
| subtopic-1-21 | (Continue checking Strapi...) | *pending* |
| subtopic-1-22 | (Continue checking Strapi...) | *pending* |
| subtopic-1-23 | (Continue checking Strapi...) | *pending* |
| subtopic-1-24 | (Continue checking Strapi...) | *pending* |
| subtopic-1-25 | (Continue checking Strapi...) | *pending* |

---

## Instructions

### How to Get Missing IDs

1. **Open Strapi Admin Panel:** `http://localhost:1337/admin`
2. **Go to Content Manager** → **Subtopics**
3. **Scroll down** to see all subtopics
4. **Note the ID** for each (visible in API responses or URL)
5. **Copy numeric IDs only** (not documentId)

### Alternative: Get via API

```bash
curl "http://localhost:1337/api/subtopics?pagination[limit]=100" | jq '.data[] | {title: .title, id: .id}'
```

---

## Why Numeric ID is Better

| Aspect | Numeric ID | documentId |
|--------|-----------|----------|
| Length | `2` | `nmrmtsk63gbjdp3ull7oncab` |
| Performance | Faster lookups | Slightly slower |
| Readability | Easy | Hard to remember |
| Filter Syntax | `filters[subtopic][id][$eq]=2` | `filters[subtopic][documentId][$eq]=nmrmtsk63gbjdp3ull7oncab` |

**Recommendation: Use numeric `id` in `lib/strapiIdMapping.ts`**

---

## Testing Filters Work

Both of these work in Strapi:

**With numeric ID:**
```bash
curl "http://localhost:1337/api/videos?filters[subtopic][id][$eq]=2"
```
✅ Returns 2 videos for "Personal Hygiene"

**With documentId:**
```bash
curl "http://localhost:1337/api/videos?filters[subtopic][documentId][$eq]=nmrmtsk63gbjdp3ull7oncab"
```
✅ Also returns 2 videos for "Personal Hygiene"

Both work, but numeric is simpler!

---

## Next: Update strapiIdMapping.ts

Once you have all 25 IDs, update `lib/strapiIdMapping.ts`:

```typescript
export const strapiIdMapping: Record<string, number> = {
  'subtopic-1-1': 2,   // Personal Hygiene
  'subtopic-1-2': 4,   // Presentation Skills
  'subtopic-1-3': 6,   // Plating & Packing
  'subtopic-1-4': 8,   // Waste Management
  // ... and so on
};
```
