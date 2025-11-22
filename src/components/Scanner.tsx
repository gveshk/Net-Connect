'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X } from 'lucide-react';

interface ScannerProps {
    onScan: (decodedText: string) => void;
    onClose: () => void;
}

export default function Scanner({ onScan, onClose }: ScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                videoConstraints: {
                    facingMode: "environment"
                }
            },
      /* verbose= */ false
        );

        scannerRef.current = scanner;

        scanner.render(
            (decodedText) => {
                onScan(decodedText);
                scanner.clear();
            },
            (errorMessage) => {
                // Ignore parse errors, they happen constantly when no QR is in view
            }
        );

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        };
    }, [onScan]);

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 z-50"
            >
                <X size={24} />
            </button>

            <div className="w-full max-w-md px-4 relative">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Scan Target</h2>
                    <p className="text-gray-400 text-sm">Align QR code within the frame</p>
                </div>

                <div className="relative overflow-hidden rounded-3xl border-2 border-primary/50 shadow-[0_0_50px_rgba(0,255,157,0.2)]">
                    {/* Scanner Element */}
                    <div id="reader" className="w-full bg-black"></div>

                    {/* Overlay UI */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-3xl"></div>
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-3xl"></div>

                        {/* Scanning Line Animation */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_20px_#00ff9d] animate-[scan_2s_linear_infinite]"></div>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 text-red-500 text-center text-sm bg-red-500/10 p-2 rounded-lg">
                        {error}
                    </div>
                )}
            </div>

            <style jsx global>{`
        #reader video {
          object-fit: cover;
          border-radius: 1.5rem;
        }
        #reader__scan_region {
          background: transparent !important;
        }
        #reader__dashboard_section_csr span, 
        #reader__dashboard_section_swaplink {
          display: none !important;
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
        </div>
    );
}
