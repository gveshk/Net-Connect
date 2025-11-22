'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function logConnection(scannedUsername: string, greetingId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // 1. Log Connection
    const { error: logError } = await supabase.from('connections').insert({
        user_id: user.id,
        scanned_username: scannedUsername,
        greeting_used_id: greetingId,
        scanned_at: new Date().toISOString()
    });

    if (logError) {
        console.error('Error logging connection:', logError);
        throw new Error('Failed to log connection');
    }

    // 2. Update XP and Streak
    // Fetch current profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level, streak, updated_at')
        .eq('id', user.id)
        .single();

    if (profile) {
        const xpGain = 10;
        let newXp = (profile.xp || 0) + xpGain;
        let newLevel = profile.level || 1;

        // Simple leveling logic: Level up every 100 * Level XP
        const nextLevelXp = newLevel * 100;
        let leveledUp = false;

        if (newXp >= nextLevelXp) {
            newLevel += 1;
            newXp = newXp - nextLevelXp;
            leveledUp = true;
        }

        // Streak Logic (Basic: if last update was yesterday, +1. If today, same. If older, reset to 1)
        const lastUpdate = new Date(profile.updated_at || 0);
        const today = new Date();
        const isSameDay = lastUpdate.toDateString() === today.toDateString();
        const isYesterday = new Date(today.setDate(today.getDate() - 1)).toDateString() === lastUpdate.toDateString();

        let newStreak = profile.streak || 0;
        if (isYesterday) {
            newStreak += 1;
        } else if (!isSameDay) {
            newStreak = 1; // Reset if missed a day or first time
        }

        const { error: updateError } = await supabase.from('profiles').update({
            xp: newXp,
            level: newLevel,
            streak: newStreak,
            updated_at: new Date().toISOString()
        }).eq('id', user.id);

        if (updateError) console.error('Error updating stats:', updateError);

        revalidatePath('/dashboard');
        return { success: true, xpGained: xpGain, leveledUp, newLevel };
    }

    return { success: false };
}
