"use client";

import Image from "next/image";
import Link from "next/link";

export interface Painting {
  id: string;
  title: string;
  medium: string;
  dimensions: string;
  year: string;
  status: "Available" | "Sold";
  price: string;
  image: string;
}

interface PaintingCardProps {
  painting: Painting;
  onInquire?: (painting: Painting) => void;
}

export default function PaintingCard({ painting, onInquire }: PaintingCardProps) {
  const isAvailable = painting.status === "Available";

  return (
    <div className="group flex flex-col gap-4 fade-in bg-[#080808] border border-white/[0.02] p-4 rounded-lg hover:border-white/[0.06] transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900 rounded-md">
        <Image
          src={painting.image}
          alt={painting.title}
          fill
          sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={false}
        />
        {/* Status Badge */}
        <span
          className={`absolute top-4 right-4 px-2.5 py-1 text-[10px] tracking-wider uppercase font-medium rounded-full backdrop-blur-md border ${
            isAvailable
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
          }`}
        >
          {painting.status}
        </span>
      </div>

      {/* Details Area */}
      <div className="flex flex-col flex-1 gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-light tracking-wide text-zinc-100 group-hover:text-accent transition-colors duration-300">
            {painting.title}
          </h3>
          <span className="font-serif text-sm text-accent font-light">
            {painting.price}
          </span>
        </div>

        <div className="flex flex-col gap-1 text-xs text-zinc-500">
          <p>{painting.medium}</p>
          <p>{painting.dimensions} • {painting.year}</p>
        </div>

        {/* CTA Actions */}
        <div className="mt-auto pt-4 flex gap-3">
          <Link
            href={`/gallery?id=${painting.id}`}
            scroll={false}
            className="flex-1 text-center py-2 px-3 border border-zinc-800 hover:border-zinc-500 rounded text-[11px] tracking-widest text-zinc-400 hover:text-white transition-all duration-300"
          >
            VIEW DETAILS
          </Link>
          {isAvailable && (
            <button
              onClick={() => onInquire?.(painting)}
              className="flex-1 py-2 px-3 bg-accent hover:bg-accent-light text-black font-semibold rounded text-[11px] tracking-widest transition-all duration-300"
            >
              INQUIRE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
