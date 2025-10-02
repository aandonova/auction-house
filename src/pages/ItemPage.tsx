import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AuctionItem } from "../types/item";
import { fetchLots } from "../services/api";
import Countdown from "../components/Countdown";

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<AuctionItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLots()
      .then((data) => setItem(data.find((i) => i.id === Number(id)) ?? null))
      .catch((err) => console.error("Failed to load item", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-gray-600 dark:text-gray-300">Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">Item not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-xl bg-gray-200 dark:bg-gray-800 dark:text-gray-100 px-4 py-2 text-sm hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          ← Back
        </button>
      </div>
    );
  }

  const statusChip =
    item.status === "live"
      ? "bg-emerald-100 text-emerald-700"
      : item.status === "upcoming"
      ? "bg-amber-100 text-amber-700"
      : "bg-gray-100 text-gray-700";

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-950 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{item.title}</h1>
        <span className={`inline-flex items-center px-3 py-1 text-xs rounded-full ${statusChip}`}>
          {item.status}
        </span>
      </div>

      {/* Main content */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-2">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full rounded-xl aspect-video object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://picsum.photos/id/760/800/450?grayscale";
            }}
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-5">
            <div className="flex flex-col gap-3">
              <div className="text-sm text-gray-500 dark:text-gray-400">Time Left</div>
              <div className="text-lg font-semibold">
                <Countdown endDate={item.endDate} status={item.status} startDate={item.startDate} />
              </div>          
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-5">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Auction House</dt>
                <dd className="font-medium">{item.auctionHouse}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Category</dt>
                <dd className="font-medium">{item.category}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">Estimated Value</dt>
                <dd className="font-semibold text-amber-700">${item.estimatedValue}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">End Date</dt>
                <dd className="font-medium">
                  {new Date(item.endDate).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-5">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.description}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <Link
          to={`/category/${item.category}`}
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          ← Back to {item.category}
        </Link>
      </div>
    </div>
  );
}
