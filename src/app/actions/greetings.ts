'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addGreeting(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    const label = formData.get('label') as string;
    const text = formData.get('text') as string;

    if (!label || !text) return;

    const { error } = await supabase.from('greetings').insert({
        user_id: user.id,
        label,
        text,
        is_active: true
    });

    if (error) {
        console.error('Error adding greeting:', error);
        throw new Error('Failed to add greeting');
    }

    revalidatePath('/dashboard/greetings');
    revalidatePath('/dashboard'); // Update dashboard if we show count there
}

export async function deleteGreeting(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    const { error } = await supabase.from('greetings').delete().match({ id, user_id: user.id });

    if (error) {
        console.error('Error deleting greeting:', error);
        throw new Error('Failed to delete greeting');
    }

    revalidatePath('/dashboard/greetings');
}
