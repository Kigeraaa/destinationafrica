import Link from 'next/link';
import { MessageCircle, ShieldCheck, Star } from 'lucide-react';
import { Tour } from '@/lib/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=60';

interface TourCardProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
  return (
    <div className="card overflow-hidden">
      <img
        src={tour.image_url || FALLBACK_IMAGE}
        alt={tour.title}
        className="h-52 w-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
        }}
      />
      <div className="p-5">
        <div className="flex gap-2 flex-wrap">
          {tour.country?.name && <span className="badge">{tour.country.name}</span>}
          {tour.category?.name && <span className="badge">{tour.category.name}</span>}
        </div>
        <h3 className="mt-3 text-lg font-black">{tour.title}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {[tour.destination?.name, `${tour.duration_days} days`, `up to ${tour.group_size} guests`]
            .filter(Boolean)
            .join(' • ')}
        </p>
        <p className="mt-2 flex items-center gap-1 text-sm">
          <ShieldCheck size={16} className="text-forest" />
          {tour.operator?.company_name || 'Verified Operator'}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-black">${tour.price}</span>
          <span className="flex items-center gap-1 text-sm">
            <Star size={16} className="fill-savanna text-savanna" />
            {tour.rating} ({tour.review_count})
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Link
            className="btn btn-primary col-span-2 py-2 text-center"
            href={`/tours/${tour.slug}`}
          >
            View
          </Link>
          <button
            className="rounded-full border border-slate-200 p-2 hover:bg-sand transition"
            aria-label="Message operator"
          >
            <MessageCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}