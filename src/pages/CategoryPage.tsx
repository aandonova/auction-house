import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AuctionItem } from "../types/item";
import { fetchLots } from "../services/api";

export default function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLots()
      .then((data) => {
        setItems(data.filter((i) => i.category === name));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [name]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-300">Loading...</p>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-10 bg-gray-50 dark:bg-gray-950 dark:text-gray-100">
      {/* Breadcrumb + Back */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg px-3 py-1.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          ← Back
        </button>
        <span className="capitalize font-semibold text-gray-900 dark:text-gray-100">
          {name}
        </span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight">{name} Items</h1>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/item/${item.id}`}
            className="group block rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition h-full"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full aspect-[4/3] object-cover rounded-t-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://picsum.photos/400/300?grayscale&random=" + item.id;
              }}
            />
            <div className="p-4 flex flex-col gap-2">
              <h2 className="font-semibold text-lg text-indigo-600 group-hover:text-indigo-700 line-clamp-2">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.auctionHouse}
              </p>
              <p className="text-sm">
                Estimate:{" "}
                <span className="text-amber-700 font-semibold">
                  ${item.estimatedValue}
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-300">
          No items found in this category.
        </p>
      )}
    </div>
  );
}
