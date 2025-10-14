import type { AuctionItem } from '../types/item';
import ItemCard from './ItemCard';
import { Link } from 'react-router-dom';

export default function Section({ title, items, previewCount = 4 }: { title: string; items: AuctionItem[]; previewCount?: number }) {
  const preview = items.slice(0, previewCount);
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {items.length > preview.length && (
          <Link to={`/category/${encodeURIComponent(title)}`} className="text-blue-600 hover:underline">View more</Link>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {preview.map(i => <ItemCard key={i.id} item={i} />)}
      </div>
    </section>
  );
}
