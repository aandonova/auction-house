import { useWatchList } from "../store/watchList";

export default function WatchListButton({ id, size = "sm" }: { id: number | string; size?: "sm" | "md" }) {
    const { has, toggle } = useWatchList();
    const active = has(id);

    const base =
        "inline-flex items-center justify-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-indigo-500";
    const sizes = size === "sm" ? "w-8 h-8 text-sm" : "w-9 h-9 text-base";

    return (
        <button
            type="button"
            aria-pressed={active}
            aria-label={active ? "Remove from favorites" : "Add to favorites"}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle(id);
            }}
            className={`${base} ${sizes} bg-white/90 dark:bg-gray-900/90 border-gray-200 dark:border-gray-700 hover:scale-105 pointer-events-auto`}
            title={active ? "Remove from favorites" : "Add to favorites"}
        >
            <span className={active ? "text-rose-600" : "text-gray-500"}>{active ? "❤️" : "🤍"}</span>
        </button>
    );
}
