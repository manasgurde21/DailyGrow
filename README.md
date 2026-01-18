# DailyGrow 🌱 – Habit & Productivity Tracker

DailyGrow is a modern, mobile-first web application designed to help users build good habits, manage daily tasks, and visualize their progress towards a better lifestyle. Built with React and powered by AI, it combines effective habit tracking mechanics with personalized motivation.

## 📱 Features

### 🎯 Core Functionality
*   **Habit Tracking**: Create daily habits with customizable colors, reminders, and icons. Track your streaks and daily completion rates.
*   **Task Management**: A robust To-Do list with priority levels (Low, Medium, High) to manage daily chores and work.
*   **Gamification**: Earn streaks and visual rewards for consistency.
*   **Offline-First**: All data is stored locally in your browser using IndexedDB (via Dexie.js), ensuring privacy and offline access.

### 🧠 AI Integration (Google Gemini)
*   **Daily Motivation**: Receive a unique, context-aware motivational quote every day based on your current progress.
*   **Smart Insights**: Get personalized advice ("Coach's Insight") on how to improve your streaks and consistency based on your actual habit data.

### 📊 Analytics & Visuals
*   **Interactive Dashboard**: A clean home screen showing today's focus.
*   **Visual Charts**: Weekly rhythm bar charts and daily completion pie charts to visualize performance.
*   **Dark Mode**: Fully adaptive dark theme for night-time usage.

### 🎨 UX/UI
*   **Mobile-First Design**: Optimized for touch interfaces with bottom navigation and easy-to-reach buttons.
*   **Smooth Animations**: Polished transitions and micro-interactions for a native app feel.

## 🛠️ Tech Stack

*   **Frontend Framework**: [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Bootstrap 5](https://getbootstrap.com/) & Custom CSS Variables
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Database**: [Dexie.js](https://dexie.org/) (Wrapper for IndexedDB)
*   **AI Model**: [Google Gemini API](https://ai.google.dev/) (`gemini-3-flash-preview`)

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn

### Installation

1.  **Clone the repository** (or download the source code):
    ```bash
    git clone https://github.com/yourusername/dailygrow.git
    cd dailygrow
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure API Key**:
    *   You need a Google Gemini API Key. Get one at [Google AI Studio](https://aistudio.google.com/).
    *   Create a `.env` file in the root directory (or rename a sample if provided).
    *   Add your key:
        ```env
        API_KEY=your_google_api_key_here
        ```
    *   *Note: In the current Vite configuration setup provided in the code, the API key is expected via process.env. In a production Vite app, you usually prefix with `VITE_` or use a backend proxy. For this demo structure, ensure your environment loader is configured correctly.*

4.  **Run the application**:
    ```bash
    npm run dev
    ```

5.  **Open in Browser**:
    Visit `http://localhost:5173` (or the port shown in your terminal).

## 📂 Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # UI Components (HabitCard, TaskCard, Charts, etc.)
│   ├── services/        # Business logic (Storage, Gemini AI)
│   ├── App.tsx          # Main Application Logic
│   ├── types.ts         # TypeScript Interfaces
│   ├── constants.ts     # Static data & configuration
│   └── index.tsx        # Entry point
├── index.html           # HTML template
└── package.json         # Dependencies and scripts
```

## 🔒 Privacy & Data

DailyGrow operates on a "Local-First" architecture. 
*   **Habits & Tasks**: Stored exclusively in your browser's IndexedDB. Clearing browser data will reset your progress.
*   **AI Features**: Only strictly necessary data (habit counts, streak numbers) is sent to the Google Gemini API to generate text responses. No personal identifiable information (PII) is transmitted.

## 📄 License

This project is open-source and available under the MIT License.
