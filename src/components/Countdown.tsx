import { useEffect, useState } from "react";
import type { AuctionStatus } from "../types/item"; 

interface CountdownProps {
  endDate?: string;
  status?: AuctionStatus | string; // 'upcoming' | 'live' | 'ended'
  startDate?: string;
}

type TL = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ended: boolean;
};

function normalizeStatus(s?: string) {
  return (s || "").toString().trim().toLowerCase();
}

function calcTimeLeft(targetTs: number): TL {
  const diff = targetTs - Date.now();
  if (!isFinite(diff) || diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, ended: false };
}

export default function Countdown({ endDate, status, startDate }: CountdownProps) {
  const st = normalizeStatus(status);

  const startTs = startDate ? new Date(startDate).getTime() : NaN;
  const endTs = endDate ? new Date(endDate).getTime() : NaN;

  const isUpcomingByStatus = st.includes("upcom"); 
  const isLiveByStatus = st === "live";

  const determineTarget = () => {
    const now = Date.now();

    // ако има startDate и е преди началото -> upcoming
    if (!Number.isNaN(startTs) && startTs > now) return { mode: "upcoming", target: startTs };

    // status казва upcoming (дори без startDate) -> treat as upcoming (no countdown if no startTs)
    if (isUpcomingByStatus && Number.isNaN(startTs)) return { mode: "upcoming", target: NaN };

    // ако статус е live И endTs в бъдеще -> live
    if ((isLiveByStatus || (!st && endTs > now)) && endTs > now) return { mode: "live", target: endTs };

    // ако endDate е в бъдеще (дори статус липсва) -> live
    if (endTs > now) return { mode: "live", target: endTs };

    // иначе -> ended
    return { mode: "ended", target: NaN };
  };

  const initial = () => {
    const { mode, target } = determineTarget();
    if (mode === "ended") return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true } as TL;
    if (!isFinite(target)) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true } as TL;
    return calcTimeLeft(target);
  };

  const [timeLeft, setTimeLeft] = useState<TL>(initial);

  useEffect(() => {
    const { mode, target } = determineTarget();

    if (mode === "ended") {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: true });
      return;
    }

    if (!isFinite(target)) {
      // upcoming but no startDate provided — просто показваме текст, няма timer
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, ended: true });
      return;
    }

    // обновим веднага и пуснем интервал
    setTimeLeft(calcTimeLeft(target));
    const id = setInterval(() => {
      setTimeLeft(calcTimeLeft(target));
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate, startDate, status]); // когато някой от тези се промени, ревалидираме

  // render logic
  // upcoming
  if (isUpcomingByStatus || (!Number.isNaN(startTs) && startTs > Date.now())) {
    if (!Number.isNaN(startTs)) {
      if (timeLeft.ended) return <span className="text-yellow-500 font-semibold">Starts soon</span>;
      return (
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          Starts in:{" "}
          <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {timeLeft.days > 0 && `${timeLeft.days}d `}
            {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </span>
        </span>
      );
    }
    return <span className="text-yellow-500 font-semibold">Auction not started yet</span>;
  }

  // ended
  if (timeLeft.ended) {
    return <span className="text-red-500 font-semibold">Auction Ended</span>;
  }

  // live
  return (
    <span className="font-semibold text-gray-700 dark:text-gray-200">
      Time Left:{" "}
      <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    </span>
  );
}