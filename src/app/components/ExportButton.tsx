'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Download, Loader2 } from 'lucide-react';

export default function ExportButton() {
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleExport = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch connections
            const { data: connections, error } = await supabase
                .from('connections')
                .select('*')
                .eq('user_id', user.id)
                .order('scanned_at', { ascending: false });

            if (error) throw error;
            if (!connections || connections.length === 0) {
                alert('No connections to export!');
                return;
            }

            // Generate CSV Content
            const headers = ['Name', 'Company', 'Telegram ID', 'Greeting Used', 'Timestamp'];
            const rows = connections.map(conn => {
                // Parsing logic
                const name = conn.scanned_name || conn.scanned_username;
                const company = conn.scanned_company || 'N/A';
                const telegramId = `https://t.me/${conn.scanned_username}`;
                const greeting = conn.note || 'Default Scan';
                const timestamp = new Date(conn.scanned_at).toLocaleString();

                return [
                    `"${name}"`,
                    `"${company}"`,
                    `"${telegramId}"`,
                    `"${greeting}"`,
                    `"${timestamp}"`
                ].join(',');
            });

            const csvContent = [headers.join(','), ...rows].join('\n');

            // Trigger Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `netbot_connections_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export connections.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="w-full bg-surface/50 border border-white/10 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors group"
        >
            {loading ? (
                <Loader2 size={20} className="animate-spin text-primary" />
            ) : (
                <Download size={20} className="text-primary group-hover:scale-110 transition-transform" />
            )}
            <span>Export Connections (CSV)</span>
        </button>
    );
}
