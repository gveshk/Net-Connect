'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ScannedUser, Greeting, DEFAULT_GREETINGS } from '@/app/types';
import { getPlayerStats, addXp, PlayerStats } from '@/app/utils/gamification';
import ProfileHeader from '@/app/components/ProfileHeader';
import ActionCarousel from '@/app/components/ActionCarousel';
import StatsGrid from '@/app/components/StatsGrid';
import GamificationHUD from '@/app/components/GamificationHUD';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedUser, setScannedUser] = useState<ScannedUser | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [contactDetails, setContactDetails] = useState({ name: '', company: '' });

  const [showLevelUp, setShowLevelUp] = useState(false);
  const supabase = createClient();

  const [greetings, setGreetings] = useState<Greeting[]>(DEFAULT_GREETINGS);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUser(user);
      loadStats(user.id);
      loadGreetings(user.id);
    };
    checkUser();
  }, []);

  const loadStats = async (userId: string) => {
    const playerStats = await getPlayerStats(userId);
    setStats(playerStats);
  };

  const loadGreetings = async (userId: string) => {
    const { data: customGreetings } = await supabase
      .from('greetings')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (customGreetings && customGreetings.length > 0) {
      const formattedCustom = customGreetings.map((g: any) => ({
        id: g.id,
        label: g.label,
        text: g.text,
        color: 'bg-purple-600' // Distinct color for custom greetings
      }));
      setGreetings([...formattedCustom, ...DEFAULT_GREETINGS]);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
    try {
      const username = decodedText.split('/').pop() || decodedText;

      setScannedUser({
        username: username,
        scannedAt: new Date()
      });
      // Pre-fill name with username as fallback
      setContactDetails({ name: username, company: '' });
      setShowScanner(false);
      setShowDetailsModal(true); // Open details modal
    } catch (e) {
      console.error('Scan error:', e);
    }
  };

  const handleDetailsSubmit = () => {
    setShowDetailsModal(false);
    // User can now select a greeting
  };

  const handleGreetingSelect = async (greeting: Greeting) => {
    if (!scannedUser || !user || !stats) return;

    // 1. Copy to clipboard
    await navigator.clipboard.writeText(greeting.text);

    // 2. Log connection in Supabase
    const isDefaultGreeting = DEFAULT_GREETINGS.some(g => g.id === greeting.id);

    const { error } = await supabase.from('connections').insert({
      user_id: user.id,
      scanned_username: scannedUser.username,
      scanned_name: contactDetails.name || scannedUser.username, // Use entered name or fallback
      scanned_company: contactDetails.company || 'N/A',
      greeting_used_id: isDefaultGreeting ? null : greeting.id,
      note: `Scanned via NetBot V2. Greeting: ${greeting.label}`
    });

    if (error) {
      console.error('Error logging connection:', error);
      // Continue anyway to not block the user flow
    }

    // 3. Award XP & Gamification
    const { newLevel, newXp, leveledUp } = await addXp(user.id, 10);

    if (newXp !== undefined) {
      setStats({
        ...stats,
        xp: newXp,
        level: newLevel,
        streak: stats.streak + 1,
        totalConnections: stats.totalConnections + 1,
        nextLevelXp: newLevel * 100
      });
    }

    // 4. Visual Feedback
    if (leveledUp) {
      setShowLevelUp(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00FF9D', '#00E0FF', '#FFFFFF']
      });
      setTimeout(() => setShowLevelUp(false), 3000);
    } else {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#00FF9D', '#00E0FF']
      });
    }

    // 5. Redirect
    window.location.href = `https://t.me/${scannedUser.username}`;
  };

  if (!user || !stats) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative pb-20">
      {/* Background Ambience */}
      <div className="fixed top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-secondary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <ProfileHeader user={user} stats={stats} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center gap-8 py-6">

          {/* Action Carousel (Scanner & Greetings) */}
          <ActionCarousel
            onScanStart={() => setShowScanner(true)}
            onGreetingSelect={handleGreetingSelect}
            scannedUser={scannedUser}
            greetings={greetings}
          />

          {/* Stats Grid */}
          <StatsGrid stats={stats} />
        </div>

        {/* Details Input Modal */}
        <AnimatePresence>
          {showDetailsModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <div className="w-full max-w-sm bg-surface border border-white/10 rounded-3xl p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Target Identified</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Name</label>
                    <input
                      type="text"
                      value={contactDetails.name}
                      onChange={(e) => setContactDetails({ ...contactDetails, name: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none"
                      placeholder="Enter Name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Company / Note</label>
                    <input
                      type="text"
                      value={contactDetails.company}
                      onChange={(e) => setContactDetails({ ...contactDetails, company: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none"
                      placeholder="Enter Company"
                    />
                  </div>
                  <button
                    onClick={handleDetailsSubmit}
                    className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    CONFIRM DETAILS
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level Up Modal */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <div className="bg-surface border border-primary/50 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(0,255,157,0.3)]">
                <h2 className="text-4xl font-bold text-primary mb-2">LEVEL UP!</h2>
                <p className="text-2xl text-white">Level {stats.level}</p>
                <div className="mt-4 text-sm text-gray-400">System Upgrade Complete</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanner Overlay */}
        <AnimatePresence>
          {showScanner && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-0 z-50 bg-black flex flex-col"
            >
              <div className="flex-1 relative">
                <button
                  onClick={() => setShowScanner(false)}
                  className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded-full"
                >
                  ✕
                </button>
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <ScannerComponent onScan={handleScanSuccess} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// Helper component to avoid import errors if Scanner.tsx is missing or needs client-side only
import dynamic from 'next/dynamic';
const ScannerComponent = dynamic(() => import('@/app/components/Scanner'), { ssr: false });
