'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Loader2,
  RefreshCw,
  LogOut,
  AlertCircle,
} from 'lucide-react';

interface GoogleClassroomIntegrationProps {
  conceptId: string;
}

interface Assignment {
  id: string;
  title: string;
  state: string;
  assignedGrade?: number;
  draftGrade?: number;
  maxPoints?: number;
  courseId: string;
}

interface SyncResponse {
  success: boolean;
  courses: any[];
  assignments: Assignment[];
  conceptId?: string;
  error?: string;
}

export default function GoogleClassroomIntegration({
  conceptId,
}: GoogleClassroomIntegrationProps) {
  const { concepts } = useStore();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const concept = concepts.find((c) => c.id === conceptId);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      setIsSignedIn(data.authenticated);
      if (data.authenticated) {
        await syncProgress();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsSignedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/google');
      const data = await response.json();
      
      if (!response.ok) {
        // Show detailed error message if available
        const errorMsg = data.error || 'Failed to get authorization URL';
        const hint = data.hint ? `\n\n${data.hint}` : '';
        throw new Error(errorMsg + hint);
      }
      
      if (data.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        setError('Failed to initiate Google sign-in. Please check your configuration.');
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
      setError(error.message || 'Failed to connect to Google. Please check your environment variables.');
    } finally {
      setIsLoading(false);
    }
  };

  const syncProgress = async () => {
    setIsSyncing(true);
    setError(null);

    try {
      const courseId = concept?.googleClassroomId;
      const url = courseId
        ? `/api/classroom/sync?courseId=${courseId}&conceptId=${conceptId}`
        : `/api/classroom/sync?conceptId=${conceptId}`;

      const response = await fetch(url);
      const data: SyncResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync progress');
      }

      if (data.success) {
        setAssignments(data.assignments || []);
        
        // Calculate progress
        const completed = (data.assignments || []).filter(
          (a) => a.state === 'TURNED_IN' || a.state === 'RETURNED'
        ).length;
        const total = data.assignments?.length || 0;
        
        setCompletedCount(completed);
        setTotalCount(total);
      }
    } catch (error: any) {
      console.error('Sync error:', error);
      setError(error.message || 'Failed to sync with Google Classroom');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      setIsSignedIn(false);
      setAssignments([]);
      setCompletedCount(0);
      setTotalCount(0);
      setError(null);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const getAssignmentStatus = (assignment: Assignment) => {
    if (assignment.state === 'TURNED_IN') return 'Turned In';
    if (assignment.state === 'RETURNED') return 'Graded';
    if (assignment.state === 'RECLAIMED_BY_STUDENT') return 'Reclaimed';
    return 'Not Started';
  };

  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Google Classroom</h3>
        </div>
        {isSignedIn && (
          <button
            onClick={handleSignOut}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-2 text-red-700"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {!isSignedIn ? (
        <div className="text-center py-4">
          <p className="text-gray-600 mb-4">
            Sign in with Google to sync your progress with Google Classroom
          </p>
          <button
            onClick={handleSignIn}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
          {/* Fallback control: show Sync Progress button but route to sign-in when not authenticated */}
          <div className="mt-3">
            <button
              onClick={handleSignIn}
              className="px-5 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Sync Progress
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Connected to Google Classroom</span>
          </div>

          {totalCount > 0 && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">Your Progress</span>
                <span className="text-sm font-bold text-blue-700">
                  {completedCount} of {totalCount} completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {Math.round(progressPercentage)}% complete
              </div>
            </div>
          )}

          <button
            onClick={syncProgress}
            disabled={isSyncing}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Sync Progress
              </>
            )}
          </button>

          {assignments.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Your Assignments
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {assignments.map((assignment) => {
                  const isCompleted =
                    assignment.state === 'TURNED_IN' ||
                    assignment.state === 'RETURNED';
                  const status = getAssignmentStatus(assignment);

                  return (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isCompleted
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">
                            {assignment.title}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Status: {status}
                          </div>
                          {assignment.assignedGrade !== undefined &&
                            assignment.maxPoints && (
                              <div className="text-xs text-gray-500 mt-1">
                                Grade: {assignment.assignedGrade} /{' '}
                                {assignment.maxPoints}
                              </div>
                            )}
                        </div>
                        {isCompleted && (
                          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {assignments.length === 0 && !isSyncing && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No assignments found. Click "Sync Progress" to fetch your Classroom data.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
