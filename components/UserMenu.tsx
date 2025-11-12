'use client';

import { useEffect, useState } from 'react';
import { LogOut, User } from 'lucide-react';

export default function UserMenu() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/auth/status');
        const data = await res.json();
        setAuthenticated(!!data.authenticated);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      window.location.reload();
    } catch {
      // ignore
    }
  };

  if (loading || !authenticated) return null;

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <div className="relative">
        <button
          aria-label="Profile menu"
          onClick={() => setShowMenu(!showMenu)}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <User className="w-5 h-5" />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


