import type { AuctionItem } from '../types/item';

const DATA_URL = 'https://sttrafficplatformassets.blob.core.windows.net/traffic-assets/lots.json';

export async function fetchLots(): Promise<AuctionItem[]> {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error('Failed to fetch lots');
  const data = await res.json();
  return data as AuctionItem[];
}