import { useEffect, useState, useMemo } from "react";
import Section from "../components/Section";
import type { AuctionItem } from "../types/item";
import { fetchLots } from "../services/api";
import { useDebounce } from "../store/useDebounce";

export default function HomePage() {
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  // Sorting
  const [sortOption, setSortOption] = useState("title-asc");

  useEffect(() => {
    fetchLots()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // all hooks
  const allCategories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))),
    [items]
  );
 
  //filtered by search,price
  const filteredAndSortedItems = useMemo(() => {
    const filtered = items.filter((i) => {
      const matchesSearch =
        i.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        i.description.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesCategory = category === "all" || i.category === category;

      const matchesPrice =
        (minPrice === "" || i.estimatedValue >= minPrice) &&
        (maxPrice === "" || i.estimatedValue <= maxPrice);

      return matchesSearch && matchesCategory && matchesPrice;
    });

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "price-asc":
          return a.estimatedValue - b.estimatedValue;
        case "price-desc":
          return b.estimatedValue - a.estimatedValue;
        case "end-soon":
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case "end-late":
          return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        default:
          return 0;
      }
    });
  }, [items, debouncedSearch, category, minPrice, maxPrice, sortOption]);

  //filtered filteredAndSortedItems
  const categories = useMemo(
    () => Array.from(new Set(filteredAndSortedItems.map((i) => i.category))) as string[],
    [filteredAndSortedItems]
  );

  return (
    <div className="container mx-auto p-6 space-y-10 bg-white dark:bg-gray-900 dark:text-gray-100">
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-300">Loading...</p>
      ) : (
        <>
          {/* Filters + Sort */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {/* Search */}
            <input
              type="text"
              placeholder="🔍 Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 px-4 rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 px-4 rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Min Price */}
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
              className="h-12 px-4 rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Max Price */}
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
              className="h-12 px-4 rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Sorting */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="h-12 px-4 rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="title-asc">Title (A → Z)</option>
              <option value="title-desc">Title (Z → A)</option>
              <option value="price-asc">Price (Low → High)</option>
              <option value="price-desc">Price (High → Low)</option>
              <option value="end-soon">End Date (Soonest)</option>
              <option value="end-late">End Date (Latest)</option>
            </select>
          </div>

          {/* Sections */}
          {categories.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300 text-center">No items found.</p>
          ) : (
            categories.map((cat) => {
              const catItems = filteredAndSortedItems.filter((i) => i.category === cat);
              return (
                <Section key={cat} title={cat} items={catItems} previewCount={4} />
              );
            })
          )}
        </>
      )}
    </div>
  );
}
