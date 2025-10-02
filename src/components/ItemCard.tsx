import type { AuctionItem } from '../types/item';
import { Link } from 'react-router-dom';
import Countdown from './Countdown';

export default function ItemCard({ item }: { item: AuctionItem }) {
  return (

    <Link to={`/item/${item.id}`} className="block">
      <div className="bg-white dark:bg-gray-900 dark:text-gray-100 shadow item-card rounded-lg overflow-hidden hover:shadow-lg transition item-card">
        <img src=
          {item.imageUrl} 
          alt={item.title} 
          className="w-full h-40 object-cover" 
          onError={(e) => {(e.target as HTMLImageElement).src =
          "https://picsum.photos/id/760/532/595?random=40";
        }}/>
        <div className="flex items-center justify-between m-1">
          <p className="text-sm bg-white dark:bg-gray-900 dark:text-gray-100">Estimate: ${item.estimatedValue}</p>
          <Countdown endDate={item.endDate} status={item.status} />
        </div>
        <div className="p-3">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300 truncate">{item.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-medium">${item.estimatedValue}</span>
            <span className="text-xs px-2 py-1 rounded-full border">{item.status}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
