import { Link } from "react-router-dom";
import { useWatchList } from "../store/watchList";

export default function NavWatchlist() {
    const { ids } = useWatchList();
    const count = ids.length;

    return (
        <Link
            to="/watchList"
            className="relative inline-flex items-center gap-2 rounded-lg px-3 py-1.5 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Open favorites"
            title="Watchlist"
        >
            <span role="img" aria-hidden>❤️</span>
            <span className="text-sm">Favorites</span>
            {count > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center px-1">
                    {count}
                </span>
            )}
        </Link>
    );
}
