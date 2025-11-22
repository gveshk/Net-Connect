import { createClient } from '@/utils/supabase/client';

export interface PlayerStats {
    level: number;
    xp: number;
    streak: number;
    totalConnections: number;
    nextLevelXp: number;
}

export const getPlayerStats = async (userId: string): Promise<PlayerStats> => {
    const supabase = createClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('level, xp, streak')
        .eq('id', userId)
        .single();

    const { count } = await supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    const level = profile?.level || 1;
    const xp = profile?.xp || 0;
    const streak = profile?.streak || 0;
    const nextLevelXp = level * 100; // Simple linear progression for now

    return {
        level,
        xp,
        streak,
        totalConnections: count || 0,
        nextLevelXp
    };
};

export const addXp = async (userId: string, amount: number) => {
    const supabase = createClient();

    // Get current stats
    const { data: profile } = await supabase
        .from('profiles')
        .select('level, xp')
        .eq('id', userId)
        .single();

    // Default to 0 XP / Level 1 if profile missing
    let currentXp = profile?.xp || 0;
    let currentLevel = profile?.level || 1;

    let newXp = currentXp + amount;
    let newLevel = currentLevel;
    let leveledUp = false;

    const nextLevelXp = currentLevel * 100;

    if (newXp >= nextLevelXp) {
        newLevel++;
        newXp = newXp - nextLevelXp;
        leveledUp = true;
    }

    // Upsert DB (Create if missing, Update if exists)
    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            xp: newXp,
            level: newLevel,
            updated_at: new Date().toISOString()
        });

    if (error) {
        console.error('Error updating XP:', error);
        return { newLevel, newXp, leveledUp: false, error };
    }

    return { newLevel, newXp, leveledUp };
};
