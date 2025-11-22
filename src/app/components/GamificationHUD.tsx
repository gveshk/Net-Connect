import { PlayerStats } from '../utils/gamification';

interface GamificationHUDProps {
    stats: PlayerStats;
}

export default function GamificationHUD({ stats }: GamificationHUDProps) {
    // This component might be redundant with StatsGrid and ProfileHeader, 
    // but keeping it for completeness if referenced elsewhere or for specific overlay UI.
    // For now, it can be a simple floating badge or similar.
    return (
        <div className="fixed top-4 right-4 z-40 bg-black/50 backdrop-blur-md border border-primary/30 rounded-full px-4 py-2 flex items-center gap-3">
            <div className="flex flex-col items-end">
                <span className="text-xs text-primary font-bold">LVL {stats.level}</span>
                <span className="text-[10px] text-gray-400">{stats.xp} / {stats.nextLevelXp} XP</span>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center bg-primary/20">
                <span className="text-xs font-bold text-white">{stats.streak}🔥</span>
            </div>
        </div>
    );
}
