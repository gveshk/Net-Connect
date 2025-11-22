import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { addGreeting, deleteGreeting } from '@/app/actions/greetings';

export default async function GreetingsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    const { data: greetings } = await supabase
        .from('greetings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6 pb-20 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 relative z-10">
                <Link href="/dashboard" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft size={20} className="text-gray-400" />
                </Link>
                <h1 className="text-2xl font-bold text-white">Protocols</h1>
            </div>

            <main className="relative z-10 space-y-6">

                {/* Add New Form */}
                <div className="bg-surface/30 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Plus size={16} /> New Protocol
                    </h2>
                    <form action={addGreeting} className="space-y-4">
                        <div>
                            <input
                                name="label"
                                type="text"
                                placeholder="Label (e.g., 'Tech Conference')"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none transition-colors text-sm"
                                required
                            />
                        </div>
                        <div>
                            <textarea
                                name="text"
                                placeholder="Message Template..."
                                rows={3}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary focus:outline-none transition-colors text-sm resize-none"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-xl transition-colors text-sm border border-white/5">
                            SAVE PROTOCOL
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="space-y-3">
                    <h3 className="text-xs text-gray-500 uppercase tracking-widest font-mono">Active Protocols</h3>

                    {greetings?.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            No protocols defined. Create one above.
                        </div>
                    )}

                    {greetings?.map((greeting) => (
                        <div key={greeting.id} className="bg-surface/50 border border-white/5 rounded-xl p-4 flex justify-between items-start group hover:border-primary/30 transition-colors">
                            <div>
                                <h4 className="font-bold text-white text-sm mb-1">{greeting.label}</h4>
                                <p className="text-gray-400 text-xs line-clamp-2">{greeting.text}</p>
                            </div>
                            <form action={deleteGreeting.bind(null, greeting.id)}>
                                <button type="submit" className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </form>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}
