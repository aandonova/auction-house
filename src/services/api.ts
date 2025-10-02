import type { AuctionItem } from "../types/item";

const LOCAL_URL = "/lots.json";
const REMOTE_URL = "https://sttrafficplatformassets.blob.core.windows.net/traffic-assets/lots.json";

export async function fetchLots(): Promise<AuctionItem[]> {
  try {
    const res = await fetch(REMOTE_URL);
    if (!res.ok) throw new Error(`Remote fetch failed: ${res.status}`);
    return (await res.json()) as AuctionItem[];
  } catch (err) {
    console.warn("Falling back to local lots.json due to error:", err);
    const res = await fetch(LOCAL_URL);
    return (await res.json()) as AuctionItem[];
  }
}