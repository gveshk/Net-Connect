# Net-Connect - Elite Networking Intelligence

Net-Connect is a premium, gamified networking agent designed to streamline professional connections in Web3 and beyond. It combines a cyberpunk aesthetic with powerful features like QR scanning, custom greeting protocols, and an XP-based progression system.

## 🚀 Features

*   **⚡ Instant QR Scanning**: Rapidly scan target QR codes (Telegram, etc.) to initiate connections.
*   **🎮 Gamification System**: Earn **10 XP** per connection, level up, and maintain a daily streak.
*   **🤖 Custom Protocols**: Create and manage personalized greeting messages for different contexts (Casual, Business, Crypto, etc.).
*   **📝 Manual Entry**: Manually add Name and Company details for every scan to keep your records organized.
*   **📊 CSV Export**: Download your entire connection history (Name, Company, Telegram, Timestamp) for external use.
*   **🔐 Web3 & Social Auth**: Sign in with Email, Google, Ethereum (MetaMask), or Solana (Phantom).
*   **💎 Premium UI**: A fully responsive, dark-mode interface with glassmorphism, neon effects, and smooth animations.

## 🛠️ Tech Stack

*   **Framework**: Next.js 14 (App Router)
*   **Styling**: Tailwind CSS v3, Framer Motion
*   **Backend**: Supabase (PostgreSQL, Auth, Realtime)
*   **Web3**: ethers.js, @solana/web3.js
*   **Utilities**: html5-qrcode, canvas-confetti, lucide-react

## 🏁 Getting Started

### Prerequisites

*   Node.js 18+
*   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    cd net-connect
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

    > **⚠️ IMPORTANT**: For Web3 Login to work without email verification errors:
    > 1. Go to your **Supabase Dashboard** -> **Authentication** -> **Providers** -> **Email**.
    > 2. **Disable** "Confirm email".

4.  **Database Migration (Critical)**:
    Run this SQL in your Supabase SQL Editor to enable Manual Entry features:
    ```sql
    ALTER TABLE public.connections 
    ADD COLUMN scanned_name text,
    ADD COLUMN scanned_company text;
    ```

5.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

6.  **Open the App**:
    Visit `http://localhost:3000` in your browser.

## 🚀 Deployment (Vercel)

1.  **Push to GitHub**: Create a repository and push your code.
2.  **Import to Vercel**: Go to [vercel.com](https://vercel.com), add a new project, and import your repo.
3.  **Environment Variables**: In Vercel Project Settings, add:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4.  **Deploy**: Click Deploy.
5.  **Update Supabase**: Add your Vercel URL (e.g., `https://net-connect.vercel.app`) to **Supabase Auth -> URL Configuration** as the Site URL and Redirect URL.

## 📱 Usage Guide

1.  **Login**: Authenticate using your preferred method.
2.  **Home Hub**:
    *   **Scan Target**: Click the large scan card to open the QR scanner.
    *   **Manual Entry**: After scanning, enter the person's Name and Company.
    *   **Quick Stats**: View your current Level, XP, and Streak.
3.  **Dashboard** (Click your Profile):
    *   **Export Connections**: Download your history as a CSV file.
    *   **Manage Greetings**: Create new custom greetings.
    *   **Detailed Stats**: View your total connection history.

## 📄 License

MIT License
