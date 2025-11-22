import { PlayerStats } from '../utils/gamification';
import { Zap, Users, Trophy } from 'lucide-react';

interface StatsGridProps {
    stats: PlayerStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-3 gap-4 px-6">
            <div className="bg-surface/30 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <Zap size={20} className="text-yellow-400 mb-2" />
                <span className="text-2xl font-bold text-white">{stats.streak}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Streak</span>
            </div>
            <div className="bg-surface/30 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <Users size={20} className="text-blue-400 mb-2" />
                <span className="text-2xl font-bold text-white">{stats.totalConnections}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Links</span>
            </div>
            <div className="bg-surface/30 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <Trophy size={20} className="text-purple-400 mb-2" />
                <span className="text-2xl font-bold text-white">{stats.level}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Rank</span>
            </div>
        </div>
    );
}
