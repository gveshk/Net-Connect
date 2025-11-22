'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Scanner from '@/components/Scanner';
import { logConnection } from '@/app/actions/scan';
import { ArrowLeft, Send, Check } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';

interface Greeting {
    id: string;
    label: string;
    text: string;
}

export default function ScanPage() {
    const [isScanning, setIsScanning] = useState(true);
    const [scannedUsername, setScannedUsername] = useState<string | null>(null);
    const [greetings, setGreetings] = useState<Greeting[]>([]);
    const [selectedGreeting, setSelectedGreeting] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Fetch greetings on mount
        const fetchGreetings = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('greetings')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('is_active', true);
                if (data) {
                    setGreetings(data);
                    if (data.length > 0) setSelectedGreeting(data[0].id);
                }
            }
        };
        fetchGreetings();
    }, []);

    const handleScan = (decodedText: string) => {
        let username = decodedText;
        if (decodedText.includes('t.me/')) {
            username = decodedText.split('t.me/')[1].split('?')[0];
        }
        setScannedUsername(username);
        setIsScanning(false);
    };

    const handleConnect = async () => {
        if (!scannedUsername || !selectedGreeting) return;
        setIsProcessing(true);

        try {
            // 1. Copy to Clipboard
            const greeting = greetings.find(g => g.id === selectedGreeting);
            if (greeting) {
                await navigator.clipboard.writeText(greeting.text);
            }

            // 2. Log Action
            const result = await logConnection(scannedUsername, selectedGreeting);

            // 3. Visual Feedback
            if (result.success) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#00ff9d', '#bd00ff']
                });

                if (result.leveledUp) {
                    setTimeout(() => {
                        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
                        alert(`LEVEL UP! You are now Level ${result.newLevel}`);
                    }, 500);
                }
            }

            // 4. Redirect
            setTimeout(() => {
                window.location.href = `https://t.me/${scannedUsername}`;
            }, 1000);

        } catch (error) {
            console.error('Connection failed:', error);
            alert('Failed to log connection. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6 relative">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 relative z-10">
                <Link href="/dashboard" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft size={20} className="text-gray-400" />
                </Link>
                <h1 className="text-2xl font-bold text-white">New Connection</h1>
            </div>

            {isScanning ? (
                <Scanner onScan={handleScan} onClose={() => router.push('/dashboard')} />
            ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Target Card */}
                    <div className="bg-surface/50 border border-primary/30 rounded-2xl p-6 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
                        <div className="w-20 h-20 bg-black rounded-2xl mx-auto mb-4 flex items-center justify-center border border-white/10">
                            <span className="text-4xl">👾</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">@{scannedUsername}</h2>
                        <p className="text-primary text-xs uppercase tracking-widest">Target Acquired</p>
                    </div>

                    {/* Greeting Selection */}
                    <div>
                        <h3 className="text-gray-400 text-sm mb-4 uppercase tracking-wider font-mono">Select Protocol</h3>
                        <div className="space-y-3">
                            {greetings.map((g) => (
                                <button
                                    key={g.id}
                                    onClick={() => setSelectedGreeting(g.id)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedGreeting === g.id
                                            ? 'bg-primary/10 border-primary text-white shadow-[0_0_15px_rgba(0,255,157,0.1)]'
                                            : 'bg-surface/30 border-white/5 text-gray-400 hover:bg-surface/50'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm">{g.label}</span>
                                        {selectedGreeting === g.id && <Check size={16} className="text-primary" />}
                                    </div>
                                    <p className="text-xs opacity-70 line-clamp-2">{g.text}</p>
                                </button>
                            ))}

                            {greetings.length === 0 && (
                                <div className="text-center p-4 border border-dashed border-gray-700 rounded-xl text-gray-500 text-sm">
                                    No greetings found.
                                    <Link href="/dashboard/greetings" className="text-primary hover:underline ml-1">Create one</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleConnect}
                        disabled={isProcessing || !selectedGreeting}
                        className="w-full bg-gradient-to-r from-primary to-accent text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? 'Syncing...' : (
                            <>
                                <Send size={20} />
                                ESTABLISH LINK
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => setIsScanning(true)}
                        className="w-full text-center text-gray-500 text-xs uppercase tracking-widest hover:text-white transition-colors"
                    >
                        Rescan Target
                    </button>

                </div>
            )}
        </div>
    );
}
