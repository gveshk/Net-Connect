export interface ScannedUser {
    username: string;
    scannedAt: Date;
}

export interface Greeting {
    id: string;
    label: string;
    text: string;
    color: string;
}

export const DEFAULT_GREETINGS: Greeting[] = [
    { id: '550e8400-e29b-41d4-a716-446655440000', label: 'Casual', text: "Hey! Let's connect on Telegram.", color: 'bg-blue-500' },
    { id: '550e8400-e29b-41d4-a716-446655440001', label: 'Professional', text: "Hello, I'd like to discuss business opportunities. Here's my contact.", color: 'bg-purple-500' },
    { id: '550e8400-e29b-41d4-a716-446655440002', label: 'Event', text: "Great meeting you at the event! Let's stay in touch.", color: 'bg-green-500' },
    { id: '550e8400-e29b-41d4-a716-446655440003', label: 'Crypto', text: "GM! Let's build something cool in Web3.", color: 'bg-orange-500' },
];
