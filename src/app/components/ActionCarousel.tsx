import { motion } from 'framer-motion';
import { Greeting, ScannedUser } from '../types';
import { Scan, MessageSquare, Send } from 'lucide-react';

interface ActionCarouselProps {
    onScanStart: () => void;
    onGreetingSelect: (greeting: Greeting) => void;
    scannedUser: ScannedUser | null;
    greetings: Greeting[];
}

export default function ActionCarousel({ onScanStart, onGreetingSelect, scannedUser, greetings }: ActionCarouselProps) {
    return (
        <div className="w-full overflow-x-auto pb-4 px-4 scrollbar-hide">
            <div className="flex gap-4 w-max mx-auto">

                {/* Main Action: Scan */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onScanStart}
                    className="w-64 h-80 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/50 flex flex-col items-center justify-center gap-4 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-primary/10 blur-xl group-hover:bg-primary/20 transition-colors"></div>
                    <div className="w-20 h-20 rounded-full bg-black/50 border border-primary flex items-center justify-center z-10 shadow-[0_0_30px_rgba(0,255,157,0.3)]">
                        <Scan size={40} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white z-10">SCAN TARGET</h3>
                    <p className="text-gray-400 text-sm z-10">Initiate Neural Link</p>
                </motion.button>

                {/* Greetings Cards */}
                {greetings.map((greeting) => (
                    <motion.button
                        key={greeting.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onGreetingSelect(greeting)}
                        disabled={!scannedUser}
                        className={`w-64 h-80 rounded-3xl bg-surface/50 border border-white/10 flex flex-col p-6 text-left relative overflow-hidden group ${!scannedUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className={`absolute top-0 left-0 w-full h-2 ${greeting.color}`}></div>
                        <div className="flex-1">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                                <MessageSquare size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{greeting.label}</h3>
                            <p className="text-gray-400 text-sm line-clamp-4">{greeting.text}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-white/50 group-hover:text-white transition-colors">
                            <Send size={16} />
                            <span>TRANSMIT</span>
                        </div>
                    </motion.button>
                ))}

            </div>
        </div>
    );
}
