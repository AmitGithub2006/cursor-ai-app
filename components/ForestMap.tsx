'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { sampleConcepts, sampleRegions } from '@/lib/data';
import { CheckCircle2, Lock } from 'lucide-react';

export default function ForestMap() {
  const router = useRouter();
  const { regions, concepts, initializeData, isConceptCompleted } = useStore();

  useEffect(() => {
    if (concepts.length === 0) {
      initializeData(sampleConcepts, sampleRegions);
    }
  }, [concepts.length, initializeData]);

  const handleRegionClick = (regionId: string) => {
    const region = regions.find((r) => r.id === regionId);
    if (region && region.unlocked) {
      router.push(`/region/${region.name}`);
    }
  };

  const getRegionProgress = (regionId: string) => {
    const regionConcepts = concepts.filter((c) => c.region === regionId);
    const completedCount = regionConcepts.filter((c) => isConceptCompleted(c.id)).length;
    return { completed: completedCount, total: regionConcepts.length };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {typeof window !== 'undefined' && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-300 rounded-full opacity-30"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-green-800 mb-2">
            🌲 Cooking & Nutrition Forest 🌲
          </h1>
          <p className="text-xl text-green-700">
            Explore different regions and unlock new cooking concepts!
          </p>
        </motion.div>

        <div className="relative w-full h-[600px] bg-gradient-to-br from-green-100 to-emerald-200 rounded-3xl shadow-2xl border-4 border-green-300 overflow-hidden">
          {/* Forest background decorations */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`tree-${i}`}
                className="absolute text-6xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                🌳
              </motion.div>
            ))}
          </div>

          {/* Interactive Regions */}
          {regions.map((region, index) => {
            const progress = getRegionProgress(region.id);
            const isUnlocked = region.unlocked;
            const allCompleted = progress.completed === progress.total && progress.total > 0;

            return (
              <motion.div
                key={region.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${region.position.x}%`,
                  top: `${region.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: isUnlocked ? 1 : 0.5,
                  scale: 1,
                }}
                transition={{
                  delay: index * 0.2,
                  type: 'spring',
                  stiffness: 200,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRegionClick(region.id)}
              >
                <div className="relative">
                  {/* Region Circle */}
                  <motion.div
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 ${
                      isUnlocked
                        ? 'bg-white border-green-500 hover:border-green-600'
                        : 'bg-gray-300 border-gray-400'
                    }`}
                    animate={{
                      boxShadow: isUnlocked
                        ? [
                            '0 10px 25px rgba(34, 197, 94, 0.3)',
                            '0 15px 35px rgba(34, 197, 94, 0.5)',
                            '0 10px 25px rgba(34, 197, 94, 0.3)',
                          ]
                        : '0 5px 15px rgba(0, 0, 0, 0.2)',
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  >
                    {isUnlocked ? (
                      <span>{region.icon}</span>
                    ) : (
                      <Lock className="w-8 h-8 text-gray-600" />
                    )}
                  </motion.div>

                  {/* Completion Badge */}
                  {allCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2"
                    >
                      <CheckCircle2 className="w-8 h-8 text-green-600 fill-white" />
                    </motion.div>
                  )}

                  {/* Region Label */}
                  <motion.div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                  >
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                        isUnlocked
                          ? 'bg-white text-green-800 border-2 border-green-500'
                          : 'bg-gray-200 text-gray-600 border-2 border-gray-400'
                      }`}
                    >
                      {region.displayName}
                    </div>
                    {isUnlocked && (
                      <div className="text-xs text-center mt-1 text-green-700 font-semibold">
                        {progress.completed}/{progress.total} Complete
                      </div>
                    )}
                  </motion.div>

                  {/* Pulsing glow effect for unlocked regions */}
                  {isUnlocked && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${region.color}40 0%, transparent 70%)`,
                      }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Progress indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border-2 border-green-500">
              <div className="text-sm font-semibold text-green-800">
                Overall Progress:{' '}
                {concepts.filter((c) => isConceptCompleted(c.id)).length} / {concepts.length}{' '}
                Concepts
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

