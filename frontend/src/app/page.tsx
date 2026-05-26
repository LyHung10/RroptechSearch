'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Home, Sparkles, AlertCircle } from 'lucide-react';
import PropertyCard from './components/PropertyCard';
import PropertyFilters from './components/PropertyFilters';

// Import động component Map để tránh lỗi Hydration (vì Leaflet cần môi trường trình duyệt `window`)
const PropertyMap = dynamic(() => import('./components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-50 rounded-2xl border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-zinc-500 text-sm font-medium">Đang khởi tạo bản đồ...</span>
      </div>
    </div>
  ),
});

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

interface FiltersState {
  searchQuery: string;
  category: string;
  maxPrice: number;
  minArea: number;
}

const HCMC_AMENITIES = [
  { name: 'TTTM Landmark 81 Mall', type: 'shopping', lat: 10.7975, lng: 106.7219 },
  { name: 'Bệnh viện Đa khoa Quốc tế Vinmec', type: 'hospital', lat: 10.7950, lng: 106.7205 },
  { name: 'Trường Quốc tế Anh BIS HCMC', type: 'school', lat: 10.8035, lng: 106.7368 },
  { name: 'TTTM Estella Place & Cantavil Q2', type: 'shopping', lat: 10.7978, lng: 106.7410 },
  { name: 'Công viên Vinhomes Central Park', type: 'park', lat: 10.7952, lng: 106.7235 },
  { name: 'Công viên Bến Bạch Đằng', type: 'park', lat: 10.7735, lng: 106.7065 },
  { name: 'TTTM Takashimaya / Saigon Centre', type: 'shopping', lat: 10.7718, lng: 106.7015 },
  { name: 'Chợ Bến Thành Quận 1', type: 'shopping', lat: 10.7725, lng: 106.6980 },
  { name: 'Bệnh viện Quốc tế FV Quận 7', type: 'hospital', lat: 10.7225, lng: 106.7215 },
  { name: 'TTTM Crescent Mall Phú Mỹ Hưng', type: 'shopping', lat: 10.7198, lng: 106.7210 },
  { name: 'Công viên Lê Văn Tám Quận 3', type: 'park', lat: 10.7875, lng: 106.6905 },
  { name: 'Phố đi bộ Nguyễn Huệ', type: 'park', lat: 10.7742, lng: 106.7042 },
  { name: 'Nhà hát Thành phố', type: 'park', lat: 10.7766, lng: 106.7032 },
  { name: 'Trường Quốc tế AIS Thảo Điền', type: 'school', lat: 10.8015, lng: 106.7352 },
  { name: 'Bệnh viện Quận 2 (Lê Văn Thịnh)', type: 'hospital', lat: 10.7770, lng: 106.7820 }
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Mét
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const INITIAL_FILTERS: FiltersState = {
  searchQuery: '',
  category: '',
  maxPrice: 50, // Mặc định hiển thị tất cả dưới 50 tỷ
  minArea: 0,
};

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState<FiltersState>(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch dữ liệu từ API Backend NestJS
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Gọi API backend (cổng 5001 đã cấu hình tránh trùng)
        const response = await fetch('http://localhost:5001/properties');
        if (!response.ok) {
          throw new Error('Không thể kết nối đến máy chủ backend');
        }
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
        setError(null);
      } catch (err: any) {
        console.error('Lỗi khi fetch dữ liệu:', err);
        setError(
          'Không thể tải dữ liệu từ Backend. Hãy chắc chắn rằng bạn đã khởi động Backend NestJS (cổng 5001) và bật dịch vụ MongoDB local.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // 2. Xử lý Lọc dữ liệu Real-time ở Client-side
  useEffect(() => {
    let result = [...properties];

    // Lọc theo từ khóa tìm kiếm (tiêu đề, địa chỉ, mô tả)
    if (filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    // Lọc theo danh mục
    if (filters.category !== '') {
      result = result.filter((item) => item.category === filters.category);
    }

    // Lọc theo giá tối đa
    if (filters.maxPrice < 50) {
      result = result.filter((item) => item.price <= filters.maxPrice);
    }

    // Lọc theo diện tích tối thiểu
    if (filters.minArea > 0) {
      result = result.filter((item) => item.area >= filters.minArea);
    }

    setFilteredProperties(result);

    // Reset lại selection nếu nhà được chọn không nằm trong kết quả lọc nữa
    if (selectedProperty && !result.some((item) => item.id === selectedProperty.id)) {
      setSelectedProperty(null);
    }
  }, [filters, properties, selectedProperty]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-900 font-sans overflow-hidden">
      {/* HEADER BANNER - CHÀO ĐÓN NHÀ TUYỂN DỤNG PROPERTYGURU */}
      <header className="sticky top-0 z-[1000] w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-md">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-zinc-900 dark:text-white tracking-tight">
                  PropertyGuru Vietnam Map Search
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-600 rounded-full dark:bg-red-950/50 dark:text-red-400 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> Live Demo
                </span>
              </div>
              <p className="text-zinc-500 text-xs font-medium">Internship Program 2026 - Assessment Center Project</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
              HCMC Active Area
            </span>
          </div>
        </div>
      </header>

      {/* CORE CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 pb-6 flex flex-col lg:flex-row gap-6 overflow-hidden">

        {/* CỘT BÊN TRÁI: BỘ LỌC VÀ DANH SÁCH BẤT ĐỘNG SẢN */}
        <section className="w-full lg:w-[45%] flex flex-col gap-5 h-full overflow-y-auto pr-1 shrink-0 py-4">

          {/* Bộ lọc HOẶC Phân tích tiện ích động khi click chọn căn hộ */}
          {selectedProperty ? (
            <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/60 p-5 rounded-2xl shadow-sm flex flex-col gap-3 transition-all duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-red-600 text-white rounded-lg text-[9px] font-extrabold uppercase tracking-wide">
                    PropTech Analyzer
                  </span>
                  <h3 className="font-extrabold text-zinc-900 dark:text-white text-xs md:text-sm">
                    Tiện Ích Xung Quanh (Bán Kính 1.5km)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProperty(null)}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-white font-bold cursor-pointer"
                >
                  Đóng
                </button>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
                Đang quét bán kính căn:{' '}
                <span className="text-red-600 dark:text-red-500 font-extrabold">
                  {selectedProperty.title}
                </span>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
                {HCMC_AMENITIES.map((amenity) => {
                  const distance = calculateDistance(
                    selectedProperty.lat,
                    selectedProperty.lng,
                    amenity.lat,
                    amenity.lng
                  );
                  return { ...amenity, distance };
                })
                  .filter((amenity) => amenity.distance <= 1500)
                  .sort((a, b) => a.distance - b.distance)
                  .slice(0, 4) // Lấy tối đa 4 tiện ích gần nhất
                  .map((amenity, idx) => {
                    const walkTime = (amenity.distance / 83.3).toFixed(0);
                    const driveTime = (amenity.distance / 400).toFixed(0);
                    return (
                      <div
                        key={idx}
                        className="bg-white dark:bg-zinc-900/90 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/80 flex flex-col gap-1.5 shadow-sm"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">
                            {amenity.type === 'shopping' && '🛍️'}
                            {amenity.type === 'hospital' && '🏥'}
                            {amenity.type === 'school' && '🏫'}
                            {amenity.type === 'park' && '🌳'}
                          </span>
                          <span className="font-bold text-xs text-zinc-900 dark:text-white truncate">
                            {amenity.name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                          <span>Khoảng cách:</span>
                          <span className="font-extrabold text-zinc-800 dark:text-zinc-200">
                            ~{amenity.distance.toFixed(0)}m
                          </span>
                        </div>
                        <div className="flex gap-2 text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold mt-0.5 border-t border-zinc-100 dark:border-zinc-800/60 pt-1.5">
                          <span>🚶 {walkTime} phút đi bộ</span>
                          <span>•</span>
                          <span>🚗 {driveTime === '0' ? '1' : driveTime} phút lái xe</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <PropertyFilters
              filters={filters}
              onFiltersChange={setFilters}
              onReset={handleResetFilters}
            />
          )}

          {/* Tiêu đề danh sách và kết quả đếm */}
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
              Danh sách tin đăng ({filteredProperties.length} kết quả)
            </h2>
            {selectedProperty && (
              <button
                onClick={() => setSelectedProperty(null)}
                className="text-xs text-red-600 dark:text-red-500 font-bold hover:underline cursor-pointer"
              >
                Hủy chọn
              </button>
            )}
          </div>

          {/* Danh sách tin đăng */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-10 h-10 border-4 border-zinc-300 border-t-red-600 rounded-full animate-spin"></div>
                <p className="text-zinc-500 text-sm font-medium">Đang tải danh sách bất động sản...</p>
              </div>
            ) : error ? (
              <div className="p-5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl text-red-700 dark:text-red-400 flex gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs font-medium leading-relaxed">
                  <p className="font-bold mb-1">Lỗi kết nối API:</p>
                  <p>{error}</p>
                  <p className="mt-2 text-zinc-500 font-bold">Mẹo: Bạn hãy chạy thử lệnh `npm run start:dev` ở backend để khởi chạy máy chủ.</p>
                </div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                <Home className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-3" />
                <h3 className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">Không tìm thấy kết quả phù hợp</h3>
                <p className="text-zinc-400 text-xs mt-1 max-w-[250px]">Hãy thử điều chỉnh lại bộ lọc giá, diện tích hoặc từ khóa tìm kiếm của bạn.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-xs rounded-xl cursor-pointer hover:opacity-90 transition-all"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isSelected={selectedProperty?.id === property.id}
                  onSelect={() => setSelectedProperty(property)}
                />
              ))
            )}
          </div>
        </section>

        {/* CỘT BÊN PHẢI: BẢN ĐỒ TƯƠNG TÁC (TÍNH NĂNG CỐT LÕI) */}
        <section className="flex-1 h-[450px] lg:h-full relative py-4">
          <PropertyMap
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onSelectProperty={(property) => setSelectedProperty(property)}
          />
        </section>

      </main>
    </div>
  );
}
