/**
 * Strapi ID Mapping Configuration
 * 
 * This file maps local subtopic string IDs to Strapi numeric IDs.
 * Update these IDs based on your Strapi instance.
 * 
 * Structure: COURSE → TOPIC → SUBTOPIC → VIDEOS
 * 
 * To find Strapi IDs:
 * 1. Go to Strapi Admin Panel → Content Manager → Subtopics
 * 2. For each subtopic, check the numeric ID (in URL or API response)
 * 3. Update the mapping below with actual IDs
 */

export const strapiIdMapping: Record<string, number> = {
  // CONCEPT 1: Basics in Cooking
  // ============================================
  // TOPIC 1: Grooming
  'subtopic-1-1': 2,    // Personal Hygiene
  'subtopic-1-2': 4,    // Presentation Skills
  'subtopic-1-3': 6,    // Plating and Packing

  // TOPIC 2: Standard Operating Procedures (SOP)
  'subtopic-1-4': 8,    // Waste Management
  'subtopic-1-5': 10,   // Inventory Management
  'subtopic-1-6': 12,   // Storage Practices

  // TOPIC 3: Tools & Techniques
  'subtopic-1-7': 14,   // Knife Skills
  'subtopic-1-8': 16,   // Measurement Techniques
  'subtopic-1-9': 18,   // Boiling and Pressure Cooking
  'subtopic-1-10': 20,  // Frying
  'subtopic-1-11': 22,  // Steaming
  'subtopic-1-12': 24,  // Blanching

  // TOPIC 4: Cooking Methods
  'subtopic-1-13': 26,  // No-Boil & No-Oil Cooking
  'subtopic-1-14': 28,  // Baking (Oven)
  'subtopic-1-15': 30,  // Slow Cooker
  'subtopic-1-16': 32,  // Coffee Machine
  'subtopic-1-17': 34,  // Toaster
  'subtopic-1-18': 36,  // Mixer Grinder
  'subtopic-1-19': 0,   // Placeholder - Continue from Strapi
  'subtopic-1-20': 0,   // Placeholder - Continue from Strapi

  // TOPIC 5: Appliances Training
  'subtopic-1-21': 0,   // Placeholder - Continue from Strapi
  'subtopic-1-22': 0,   // Placeholder - Continue from Strapi
  'subtopic-1-23': 0,   // Placeholder - Continue from Strapi
  'subtopic-1-24': 0,   // Placeholder - Continue from Strapi
  'subtopic-1-25': 0,   // Placeholder - Continue from Strapi

  // CONCEPT 2: Basics in Nutrition (NOT CREATED YET - Remove or add later)
  // ===================================================================
  'subtopic-2-1': 0,    // Placeholder - Create in Strapi
  'subtopic-2-2': 0,    // Placeholder - Create in Strapi
  'subtopic-2-3': 0,    // Placeholder - Create in Strapi
  'subtopic-2-4': 0,    // Placeholder - Create in Strapi
  'subtopic-2-5': 0,    // Placeholder - Create in Strapi
  'subtopic-2-6': 0,    // Placeholder - Create in Strapi
  'subtopic-2-7': 0,    // Placeholder - Create in Strapi
  'subtopic-2-8': 0,    // Placeholder - Create in Strapi
  'subtopic-2-9': 0,    // Placeholder - Create in Strapi
  'subtopic-2-10': 0,   // Placeholder - Create in Strapi
  'subtopic-2-11': 0,   // Placeholder - Create in Strapi
  'subtopic-2-12': 0,   // Placeholder - Create in Strapi
  'subtopic-2-13': 0,   // Placeholder - Create in Strapi
  'subtopic-2-14': 0,   // Placeholder - Create in Strapi

  // CONCEPT 3: Digital Basics (NOT CREATED YET - Remove or add later)
  // ================================================================
  'subtopic-3-1': 0,    // Placeholder - Create in Strapi
  'subtopic-3-2': 0,    // Placeholder - Create in Strapi
  'subtopic-3-3': 0,    // Placeholder - Create in Strapi
  'subtopic-3-4': 0,    // Placeholder - Create in Strapi
  'subtopic-3-5': 0,    // Placeholder - Create in Strapi
  'subtopic-3-6': 0,    // Placeholder - Create in Strapi
  'subtopic-3-7': 0,    // Placeholder - Create in Strapi
  'subtopic-3-8': 0,    // Placeholder - Create in Strapi
};

/**
 * Get Strapi ID for a local subtopic ID
 * Returns the Strapi numeric ID, or 0 if not found
 */
export const getStrapiIdForSubtopic = (localId: string): number => {
  const strapiId = strapiIdMapping[localId];
  if (!strapiId || strapiId === 0) {
    console.warn(
      `Strapi ID not found for subtopic "${localId}". ` +
      `Please update lib/strapiIdMapping.ts with the correct Strapi numeric ID.`
    );
    return 0;
  }
  return strapiId;
};
