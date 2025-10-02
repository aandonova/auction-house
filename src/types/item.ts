export type AuctionStatus = 'upcoming' | 'live' | 'ended';

export interface AuctionItem {
  startDate: string | undefined;
  id: number;
  title: string;
  description: string;
  category: string;
  estimatedValue: number;
  imageUrl: string;
  auctionHouse: string;
  endDate: string; // ISO string
  status: AuctionStatus;
}