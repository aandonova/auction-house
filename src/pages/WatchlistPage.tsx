import { useEffect, useMemo, useState } from "react";
import { fetchLots } from "../services/api";
import type { AuctionItem } from "../types/item";
import ItemCard from "../components/ItemCard";
import { useWatchList } from "../store/watchList";
import { Link } from "react-router-dom";

export default function WatchlistPage() {
    const { ids, clear } = useWatchList();
    const [items, setItems] = useState<AuctionItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLots()
            .then((data) => {
                console.log("[WatchlistPage] lots length =", data.length);
                setItems(data);
            })
            .finally(() => setLoading(false));

    }, []);

    const favoriteItems = useMemo(() => {
        const idSet = new Set(ids.map((x) => Number(x)).filter(Number.isFinite));
        const res = items.filter((i) => idSet.has(Number(i.id)));
        return res;
    }, [items, ids]);

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-indigo-600 hover:underline">← Home</Link>
                    <h1 className="tracking-tight text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center"> Watchlist</h1>
                </div>
            </div>
            
            {loading ? (
                <p className="text-gray-500 dark:text-gray-300">Loading...</p>
            ) : favoriteItems.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-300">
                    No favorites yet. <Link to="/" className="text-indigo-600 underline">Browse items</Link>
                </p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {favoriteItems.map((i) => (
                        <ItemCard key={i.id} item={i} />
                    ))}
                </div>
            )}
            {ids.length > 0 && (
                <button
                    onClick={clear}
                    className="rounded-lg px-3 py-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                >
                    Clear all
                </button>
            )}
        </div>
    );
}
