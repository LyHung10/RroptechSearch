'use client';

import { MapPin, BedDouble, Bath, Maximize2 } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  lat: number;
  lng: number;
  image: string;
  category: string;
  location: string;
}

interface PropertyCardProps {
  property: Property;
  isSelected: boolean;
  onSelect: () => void;
}

export default function PropertyCard({ property, isSelected, onSelect }: PropertyCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`group flex flex-col md:flex-row w-full bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 transform 
        ${isSelected 
          ? 'border-red-500 ring-2 ring-red-100 dark:ring-red-950 scale-[1.01]' 
          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
        }`}
    >
      {/* Container Ảnh Bất Động Sản */}
      <div className="relative w-full md:w-44 h-48 md:h-full overflow-hidden shrink-0">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Nhãn Category gắn nổi trên ảnh */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase bg-black/70 text-white backdrop-blur-md rounded-full shadow">
          {property.category}
        </span>
      </div>

      {/* Chi tiết Bất Động Sản */}
      <div className="flex flex-col flex-1 p-4 justify-between">
        <div>
          {/* Địa điểm */}
          <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 text-xs mb-1 font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span>{property.location}</span>
          </div>

          {/* Tiêu đề */}
          <h3 className="font-bold text-base text-zinc-900 dark:text-white line-clamp-2 leading-snug group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-200">
            {property.title}
          </h3>

          {/* Mô tả ngắn */}
          <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 mt-1.5 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Thông số kỹ thuật & Tiện ích */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-600 dark:text-zinc-400 text-xs border-t border-zinc-100 dark:border-zinc-800 pt-3">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-zinc-400" />
                <span>{property.bedrooms} PN</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-zinc-400" />
                <span>{property.bathrooms} WC</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>{property.area} m²</span>
            </div>
          </div>

          {/* Giá tiền nổi bật */}
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-red-600 dark:text-red-500 font-extrabold text-lg">
              {property.price} tỷ
            </span>
            <span className="text-zinc-400 dark:text-zinc-500 text-[10px] font-medium">
              ~{(property.price * 1000 / property.area).toFixed(1)} tr/m²
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
