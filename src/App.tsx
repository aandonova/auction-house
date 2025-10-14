import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
//pages
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ItemPage from "./pages/ItemPage";
import WatchlistPage from "./pages/WatchlistPage";

import { useDarkMode } from "./store/useDarkMode";
import { WatchListProvider } from "./store/watchList";
import NavWatchlist from "./components/NavWatchList";

export default function App() {
  const { isDark, toggle } = useDarkMode();
  return (
    <BrowserRouter>
      <WatchListProvider>
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 dark:text-gray-100">
          <div className="container mx-auto flex items-center justify-between p-4">
            <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              Auction House
            </Link>

            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">
              Discover unique items and place your bids
            </h1>
            <NavWatchlist />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-sm"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
          <div className="container mx-auto p-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:name" element={<CategoryPage />} />
              <Route path="/item/:id" element={<ItemPage />} />
              <Route path="/watchList" element={<WatchlistPage />} />
            </Routes>
          </div>
        </main>

        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="container mx-auto p-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
            <p>© {new Date().getFullYear()} Auction House. All rights reserved.</p>
            <p>Powered by React + Tailwind</p>
          </div>
        </footer>
      </WatchListProvider>
    </BrowserRouter>
  );
}
