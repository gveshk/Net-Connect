import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayerStats } from '../utils/gamification';

interface ProfileHeaderProps {
    user: any;
    stats: PlayerStats;
}

export default function ProfileHeader({ user, stats }: ProfileHeaderProps) {
    const progress = (stats.xp / stats.nextLevelXp) * 100;

    return (
        <div className="p-6 pt-12">
            <Link href="/dashboard">
                <div className="flex items-center gap-4 mb-6 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary p-[2px]">
                            <div className="w-full h-full rounded-full bg-black overflow-hidden">
                                {/* Avatar placeholder or user image */}
                                <img
                                    src={`https://api.dicebear.com/9.x/dylan/svg?seed=${user.email}`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center border border-white/20">
                            <span className="text-[10px] font-bold text-primary">V2</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{user.user_metadata?.full_name || 'Agent'}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="text-primary">● Online</span>
                            <span>|</span>
                            <span>Lvl {stats.level}</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* XP Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{stats.xp} XP</span>
                <span>{stats.nextLevelXp} XP</span>
            </div>
        </div>
    );
}
