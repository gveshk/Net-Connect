import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Scan, MessageSquare, LogOut, Zap, Trophy, Users } from 'lucide-react';
import Link from 'next/link';
import ExportButton from '@/app/components/ExportButton';

export default async function Dashboard() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch Stats (Mocked for now if 0, or real count)
    const { count: connectionCount } = await supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    const stats = {
        level: profile?.level || 1,
        xp: profile?.xp || 0,
        streak: profile?.streak || 0,
        connections: connectionCount || 0,
        nextLevelXp: (profile?.level || 1) * 100,
    };

    const xpProgress = (stats.xp / stats.nextLevelXp) * 100;

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-20 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[100px] rounded-full"></div>
            </div>

            {/* Header */}
            <header className="p-6 flex justify-between items-center relative z-10">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Command Center</h1>
                    <p className="text-xs text-gray-400 font-mono uppercase">Welcome back, Agent</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-[2px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-lg">👾</span>
                        )}
                    </div>
                </div>
            </header>

            <main className="px-6 space-y-8 relative z-10">

                {/* XP Card */}
                <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Current Level</span>
                            <div className="text-4xl font-black text-white italic">{stats.level}</div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-gray-400">{stats.xp} / {stats.nextLevelXp} XP</span>
                        </div>
                    </div>

                    <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(0,255,157,0.5)] transition-all duration-1000"
                            style={{ width: `${xpProgress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface/30 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-surface/50 transition-colors">
                        <Users size={24} className="text-accent mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.connections}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Connections</div>
                    </div>
                    <div className="bg-surface/30 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-surface/50 transition-colors">
                        <Zap size={24} className="text-yellow-400 mb-2" />
                        <div className="text-2xl font-bold text-white">{stats.streak}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Day Streak</div>
                    </div>
                </div>



                {/* Main Actions */}
                <div className="space-y-4">
                    <Link href="/scan" className="block">
                        <button className="w-full bg-gradient-to-r from-primary to-accent text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] transition-all active:scale-95 group">
                            <Scan size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span className="text-lg tracking-wide">INITIATE SCAN</span>
                        </button>
                    </Link>

                    <Link href="/dashboard/greetings" className="block">
                        <button className="w-full bg-surface/50 border border-white/10 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors">
                            <MessageSquare size={20} className="text-secondary" />
                            <span>Manage Protocols</span>
                        </button>
                    </Link>

                    <ExportButton />
                </div>

                {/* Sign Out */}
                <form action="/auth/signout" method="post">
                    <button className="w-full flex items-center justify-center gap-2 text-red-500/80 hover:text-red-500 py-4 text-sm font-medium transition-colors">
                        <LogOut size={16} />
                        DISCONNECT AGENT
                    </button>
                </form>

            </main>
        </div>
    );
}
