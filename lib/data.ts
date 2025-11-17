import { Concept, Region } from '@/types';

// Sample cooking concepts for different cuisines
export const sampleConcepts: Concept[] = [
  {
    id: 'concept-1',
    title: 'Basics in Cooking',
    description: 'Master the fundamentals of cooking from grooming to appliances',
    region: 'region-1',
    order: 1,
    unlocked: true,
    completed: false,
    topics: [
      {
        id: 'topic-1-1',
        title: 'Grooming',
        description: 'Personal grooming and presentation',
        subtopics: [
          {
            id: 'subtopic-1-1',
            title: 'Personal Hygiene',
            strapiId: 2, // Strapi ID
          },
          {
            id: 'subtopic-1-2',
            title: 'Presentation Skills',
            strapiId: 4, // Strapi ID
          },
          {
            id: 'subtopic-1-3',
            title: 'Plating and Packing',
            strapiId: 6, // Strapi ID
          },
        ],
      },
      {
        id: 'topic-1-2',
        title: 'Standard Operating Procedures (SOP)',
        description: 'Kitchen SOPs and management',
        subtopics: [
          {
            id: 'subtopic-1-4',
            title: 'Waste Management',
            strapiId: 8, // Strapi ID
          },
          {
            id: 'subtopic-1-5',
            title: 'Inventory Management',
            strapiId: 10, // Strapi ID
          },
          {
            id: 'subtopic-1-6',
            title: 'Storage Practices',
            strapiId: 12, // Strapi ID
          },
        ],
      },
      {
        id: 'topic-1-3',
        title: 'Tools & Techniques',
        description: 'Knife skills and measurement techniques',
        subtopics: [
          {
            id: 'subtopic-1-7',
            title: 'Knife Skills: Julienne',
            strapiId: 14, // Strapi ID (Knife Skills)
          },
          {
            id: 'subtopic-1-8',
            title: 'Knife Skills: Dice Cut',
            strapiId: 14, // maps to Strapi "Knife Skills" (id:14)
          },
          {
            id: 'subtopic-1-9',
            title: 'Knife Skills: Chopping',
            strapiId: 14, // maps to Strapi "Knife Skills" (id:14)
          },
          {
            id: 'subtopic-1-10',
            title: 'Knife Skills: Slicing',
            strapiId: 14, // maps to Strapi "Knife Skills" (id:14)
          },
          {
            id: 'subtopic-1-11',
            title: 'Measurement Techniques: Liquid Ingredients',
            strapiId: 16, // maps to Strapi "Measurement Techniques" (id:16)
          },
          {
            id: 'subtopic-1-12',
            title: 'Measurement Techniques: Dry Ingredients',
            strapiId: 16, // maps to Strapi "Measurement Techniques" (id:16)
          },
        ],
      },
      {
        id: 'topic-1-4',
        title: 'Cooking Methods',
        description: 'Various cooking methods and techniques',
        subtopics: [
          {
            id: 'subtopic-1-13',
            title: 'Boiling',
            strapiId: 18, // maps to Strapi "Boiling and Pressure Cooking" (id:18)
          },
          {
            id: 'subtopic-1-14',
            title: 'Pressure Cooking',
            strapiId: 18, // maps to Strapi "Boiling and Pressure Cooking" (id:18)
          },
          {
            id: 'subtopic-1-15',
            title: 'Shallow Frying',
            strapiId: 20, // maps to Strapi "Frying" (id:20)
          },
          {
            id: 'subtopic-1-16',
            title: 'Deep Frying',
            strapiId: 20, // maps to Strapi "Frying" (id:20)
          },
          {
            id: 'subtopic-1-17',
            title: 'Steaming',
            strapiId: 22, // Strapi ID (Steaming)
          },
          {
            id: 'subtopic-1-18',
            title: 'Blanching',
            strapiId: 24, // Strapi ID (Blanching)
          },
          {
            id: 'subtopic-1-19',
            title: 'No-Boil Cooking',
            strapiId: 26, // maps to Strapi "No-Boil & No-Oil Cooking" (id:26)
          },
          {
            id: 'subtopic-1-20',
            title: 'No-Oil Cooking',
            strapiId: 26, // maps to Strapi "No-Boil & No-Oil Cooking" (id:26)
          },
        ],
      },
      {
        id: 'topic-1-5',
        title: 'Appliances Training',
        description: 'Training on various kitchen appliances',
        subtopics: [
          {
            id: 'subtopic-1-21',
            title: 'Baking (Oven)',
            strapiId: 28, // Strapi ID (Baking)
          },
          {
            id: 'subtopic-1-22',
            title: 'Slow Cooker',
            strapiId: 30, // Strapi ID (Slow Cooker)
          },
          {
            id: 'subtopic-1-23',
            title: 'Coffee Machine',
            strapiId: 32, // Strapi ID (Coffee Machine)
          },
          {
            id: 'subtopic-1-24',
            title: 'Toaster',
            strapiId: 34, // Strapi ID (Toaster)
          },
          {
            id: 'subtopic-1-25',
            title: 'Mixer Grinder',
            strapiId: 36, // Strapi ID (Mixer Grinder)
          },
        ],
      },
    ],
    // Videos will be loaded from Strapi CMS
    videos: [],
    // Quiz will be loaded from Strapi CMS
    quiz: {
      id: 'quiz-1',
      passingScore: 70,
      questions: [],
    },
    googleDocsLink: 'https://docs.google.com/document/d/example1',
    googleSitesLink: 'https://sites.google.com/view/example1',
  },
  // Nutrition and Digital concepts commented out - will add when created in Strapi
  // Uncomment and update strapiIdMapping.ts when you create these concepts in Strapi
];

export const sampleRegions: Region[] = [
  {
    id: 'region-1',
    name: 'safety-garden',
    displayName: 'Safety Garden',
    color: '#22c55e',
    position: { x: 20, y: 30 },
    unlocked: true,
    concepts: sampleConcepts.filter((c) => c.region === 'region-1'),
    icon: '🛡️',
  },
  // region-2 and region-3 disabled until Nutrition and Digital concepts are created in Strapi
  // {
  //   id: 'region-2',
  //   name: 'flavor-forest',
  //   displayName: 'Flavor Forest',
  //   color: '#f59e0b',
  //   position: { x: 50, y: 20 },
  //   unlocked: false,
  //   concepts: sampleConcepts.filter((c) => c.region === 'region-2'),
  //   icon: '🌳',
  // },
  // {
  //   id: 'region-3',
  //   name: 'nutrition-meadow',
  //   displayName: 'Nutrition Meadow',
  //   color: '#3b82f6',
  //   position: { x: 80, y: 60 },
  //   unlocked: false,
  //   concepts: sampleConcepts.filter((c) => c.region === 'region-3'),
  //   icon: '🌿',
  // },
];

