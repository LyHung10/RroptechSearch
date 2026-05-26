'use client';

import { Search, RotateCcw } from 'lucide-react';

interface FiltersState {
  searchQuery: string;
  category: string;
  maxPrice: number;
  minArea: number;
}

interface PropertyFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
  onReset: () => void;
}

const CATEGORIES = ['Tất cả', 'Chung cư', 'Nhà riêng', 'Biệt thự', 'Đất nền'];

export default function PropertyFilters({ filters, onFiltersChange, onReset }: PropertyFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchQuery: e.target.value });
  };

  const handleCategorySelect = (category: string) => {
    onFiltersChange({ ...filters, category });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, maxPrice: Number(e.target.value) });
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, minArea: Number(e.target.value) });
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
      {/* Ô tìm kiếm từ khóa */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-600">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={handleSearchChange}
          placeholder="Tìm theo tiêu đề, khu vực hoặc mô tả..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-zinc-800 dark:text-zinc-200"
        />
      </div>

      {/* Bộ lọc nhanh theo Loại Bất Động Sản */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
          Loại bất động sản
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat || (cat === 'Tất cả' && filters.category === '');
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat === 'Tất cả' ? '' : cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 border 
                  ${isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hai Thanh Trượt Chọn Khoảng Lọc (Giá tiền & Diện tích) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lọc Giá (Tối đa) */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              Giá tối đa
            </span>
            <span className="font-extrabold text-red-600 dark:text-red-500 text-sm">
              {filters.maxPrice === 50 ? 'Tất cả' : `${filters.maxPrice} tỷ`}
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="50"
            step="1"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-zinc-400">
            <span>2 tỷ</span>
            <span>50 tỷ+</span>
          </div>
        </div>

        {/* Lọc Diện Tích (Tối thiểu) */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              Diện tích tối thiểu
            </span>
            <span className="font-extrabold text-zinc-800 dark:text-zinc-200 text-sm">
              {filters.minArea === 0 ? 'Tất cả' : `${filters.minArea} m²`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="10"
            value={filters.minArea}
            onChange={handleAreaChange}
            className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-zinc-200 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-zinc-400">
            <span>0 m²</span>
            <span>200 m²+</span>
          </div>
        </div>
      </div>

      {/* Nút Đặt lại bộ lọc */}
      {(filters.searchQuery !== '' || filters.category !== '' || filters.maxPrice !== 50 || filters.minArea !== 0) && (
        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-1.5 py-2 mt-1 rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Đặt lại bộ lọc
        </button>
      )}
    </div>
  );
}
