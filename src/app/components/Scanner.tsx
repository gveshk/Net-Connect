'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface ScannerProps {
    onScan: (decodedText: string) => void;
}

export default function Scanner({ onScan }: ScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                onScan(decodedText);
                // Optional: Pause or clear scanner after successful scan
                // scanner.clear(); 
            },
            (errorMessage) => {
                // console.warn(errorMessage); // Ignore scan errors for cleaner logs
            }
        );

        scannerRef.current = scanner;

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode scanner. ", error);
                });
            }
        };
    }, [onScan]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
            <div id="reader" className="w-full max-w-sm overflow-hidden rounded-3xl border-2 border-primary/50 shadow-[0_0_50px_rgba(0,255,157,0.2)]"></div>
            <p className="mt-4 text-gray-400 text-sm animate-pulse">Searching for Neural Link...</p>

            {/* Custom Overlay for Scanner Look */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-primary/30 rounded-3xl relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary -mt-1 -ml-1"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary -mt-1 -mr-1"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary -mb-1 -ml-1"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary -mb-1 -mr-1"></div>
                </div>
            </div>
        </div>
    );
}
