'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Wallet } from 'lucide-react';
import { ethers } from 'ethers';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const supabase = createClient();

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                window.location.href = '/';
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) setError(error.message);
    };

    const handleWeb3Auth = async (address: string, chain: 'eth' | 'sol') => {
        try {
            setLoading(true);
            // Strategy: Use wallet address to create a deterministic "dummy" account
            // Using gmail.com to pass strict validation (Supabase sometimes blocks random domains)
            const cleanAddress = address.toLowerCase().trim();
            const dummyEmail = `netbot-${cleanAddress}@gmail.com`;
            const dummyPassword = `netbot-secure-${cleanAddress}`;

            // 1. Try to Sign In
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: dummyEmail,
                password: dummyPassword,
            });

            if (signInError) {
                // 2. If Sign In fails, try to Sign Up
                if (signInError.message.includes('Invalid login credentials')) {
                    const { error: signUpError } = await supabase.auth.signUp({
                        email: dummyEmail,
                        password: dummyPassword,
                        options: {
                            data: {
                                full_name: `${chain.toUpperCase()} Agent`,
                                avatar_url: `https://api.dicebear.com/9.x/dylan/svg?seed=${cleanAddress}`,
                                wallet_address: cleanAddress,
                                chain: chain
                            }
                        }
                    });

                    if (signUpError) throw signUpError;

                    // Retry sign in just in case
                    const { error: retryError } = await supabase.auth.signInWithPassword({
                        email: dummyEmail,
                        password: dummyPassword,
                    });
                    if (retryError) throw retryError;

                } else {
                    throw signInError;
                }
            }

            window.location.href = '/';

        } catch (err: any) {
            console.error('Web3 Auth Error:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleEthereumLogin = async () => {
        if (typeof (window as any).ethereum !== 'undefined') {
            try {
                setLoading(true);
                const provider = new ethers.BrowserProvider((window as any).ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                await handleWeb3Auth(address, 'eth');
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    const handleSolanaLogin = async () => {
        const provider = (window as any).solana;
        if (provider && provider.isPhantom) {
            try {
                setLoading(true);
                const resp = await provider.connect();
                const address = resp.publicKey.toString();
                await handleWeb3Auth(address, 'sol');
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        } else {
            alert('Please install Phantom Wallet!');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full animate-pulse-glow"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[120px] rounded-full animate-pulse-glow delay-1000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent tracking-tighter mb-2">
                        Net-Connect
                    </h1>
                    <p className="text-gray-400 text-sm">Networking toolkit</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailAuth} className="space-y-4 mb-8">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="email"
                            placeholder="Agent Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 text-white focus:border-primary focus:outline-none transition-all focus:bg-black/60"
                            required
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="password"
                            placeholder="Passcode"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 text-white focus:border-primary focus:outline-none transition-all focus:bg-black/60"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-accent text-black font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'signin' ? 'ACCESS SYSTEM' : 'INITIALIZE AGENT')}
                    </button>
                </form>

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#0a0a0a] px-2 text-gray-500">Or connect via</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    <button
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                    </button>
                    <button
                        onClick={handleEthereumLogin}
                        className="flex items-center justify-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors group"
                        title="Ethereum"
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform">Ξ</span>
                    </button>
                    <button
                        onClick={handleSolanaLogin}
                        className="flex items-center justify-center py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors group"
                        title="Solana"
                    >
                        <Wallet size={20} className="text-[#9945FF] group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                        className="text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                        {mode === 'signin' ? "Don't have an agent ID? Initialize" : "Already initialized? Access System"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
