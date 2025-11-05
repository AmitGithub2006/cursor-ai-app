# Cooking & Nutrition Learning Platform

An interactive, gamified Next.js platform for multi-cuisine cooking and nutrition education, designed for students with limited formal education. Features video-based learning, quizzes, and Google Classroom integration.

## Features

- 🌲 **Interactive Forest Map UI**: Explore different regions (Safety Garden, Flavor Forest, Nutrition Meadow) with animated, engaging visuals
- 📹 **Video-Based Learning**: Each concept includes 3-4 instructional videos
- ✅ **Interactive Quizzes**: Test understanding with quizzes that unlock the next concept
- 🎮 **Gamified Progress**: Linear flow where completing concepts unlocks new regions
- 🎓 **Google Classroom Integration**: Sync progress and assignments with Google Classroom
- 📚 **Resource Links**: Access Google Docs and Sites for additional materials
- ✨ **Beautiful Animations**: Smooth, engaging animations throughout the platform

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Player** for video playback
- **Google APIs** for Classroom integration

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cooking-nutrition-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/classroom/callback
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cooking-nutrition-platform/
├── app/
│   ├── api/
│   │   └── classroom/          # Google Classroom API routes
│   ├── region/
│   │   └── [regionId]/         # Dynamic region pages
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page (Forest Map)
├── components/
│   ├── ForestMap.tsx            # Main interactive map component
│   ├── ConceptPage.tsx          # Concept detail page with videos
│   ├── QuizComponent.tsx        # Quiz interface
│   └── GoogleClassroomIntegration.tsx
├── lib/
│   ├── store.ts                 # Zustand state management
│   └── data.ts                  # Sample concepts and regions
├── types/
│   └── index.ts                 # TypeScript type definitions
└── public/                      # Static assets
```

## Google Classroom Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Classroom API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/classroom/callback` (development)
   - Your production URL (production)
6. Copy the Client ID and Client Secret to your `.env.local` file

## Customization

### Adding New Concepts

Edit `lib/data.ts` to add new concepts:

```typescript
{
  id: 'concept-X',
  title: 'Your Concept Title',
  description: 'Concept description',
  region: 'region-1',
  order: X,
  unlocked: false,
  completed: false,
  videos: [...],
  quiz: {...},
  googleDocsLink: '...',
  googleSitesLink: '...',
}
```

### Adding New Regions

Add new regions to `lib/data.ts`:

```typescript
{
  id: 'region-X',
  name: 'region-name',
  displayName: 'Display Name',
  color: '#hexcolor',
  position: { x: 50, y: 50 },
  unlocked: false,
  concepts: [...],
  icon: '🌳',
}
```

## Features in Detail

### Progress Tracking
- Track video completion
- Quiz scores and completion
- Concept and region unlocking
- Visual progress indicators

### Video Learning
- YouTube video integration
- Video completion tracking
- Navigation between videos
- Progress indicators

### Quiz System
- Multiple choice questions
- Immediate feedback
- Score calculation
- Passing threshold (default: 70%)

### Gamification
- Linear concept progression
- Region unlocking mechanism
- Visual completion badges
- Animated transitions

## Building for Production

```bash
npm run build
npm start
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
