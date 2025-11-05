'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { GraduationCap, BookOpen, CheckCircle2 } from 'lucide-react';

interface GoogleClassroomIntegrationProps {
  conceptId: string;
}

export default function GoogleClassroomIntegration({
  conceptId,
}: GoogleClassroomIntegrationProps) {
  const { concepts } = useStore();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);

  const concept = concepts.find((c) => c.id === conceptId);

  useEffect(() => {
    // Check if user is signed in to Google
    // This would typically check for a stored token or session
    const checkAuth = async () => {
      // Placeholder for actual Google Classroom API integration
      // In a real implementation, you would:
      // 1. Check for existing Google OAuth token
      // 2. Fetch assignments from Google Classroom API
      // 3. Sync progress with Classroom
    };
    checkAuth();
  }, [conceptId]);

  const handleSignIn = async () => {
    // Placeholder for Google OAuth sign-in
    // In a real implementation, this would:
    // 1. Redirect to Google OAuth
    // 2. Get authorization code
    // 3. Exchange for access token
    // 4. Store token securely
    setIsSignedIn(true);
  };

  const syncProgressToClassroom = async () => {
    if (!concept?.googleClassroomId) return;

    // Placeholder for syncing progress
    // In a real implementation, this would:
    // 1. Get current progress from store
    // 2. Update Google Classroom assignment
    // 3. Mark assignment as complete if quiz passed
    console.log('Syncing progress to Google Classroom...');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <GraduationCap className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Google Classroom</h3>
      </div>

      {!isSignedIn ? (
        <div className="text-center py-4">
          <p className="text-gray-600 mb-4">
            Sign in to sync your progress with Google Classroom
          </p>
          <button
            onClick={handleSignIn}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="w-5 h-5" />
            <span>Connected to Google Classroom</span>
          </div>

          {concept?.googleClassroomId && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <BookOpen className="w-5 h-5" />
                <span>Assignment ID: {concept.googleClassroomId}</span>
              </div>
              <button
                onClick={syncProgressToClassroom}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Sync Progress
              </button>
            </div>
          )}

          {assignments.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Your Assignments</h4>
              <div className="space-y-2">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="font-medium text-gray-800">{assignment.title}</div>
                    <div className="text-sm text-gray-600">{assignment.status}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

