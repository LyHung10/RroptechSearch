'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Trung tâm TP. Hồ Chí Minh (Quận 1 / Thủ Thiêm)
const DEFAULT_CENTER: [number, number] = [10.7769, 106.7009];

// Cơ sở dữ liệu danh lam, tiện ích lớn tại TP. HCM để tính khoảng cách
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

// Công thức Haversine để tính khoảng cách địa lý chính xác theo đơn vị Mét
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Bán kính Trái Đất (Mét)
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Trả về khoảng cách theo Mét
}

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

interface PropertyMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
}

// Helper component để thực hiện hiệu ứng bay (flyTo) đến tọa độ mới khi người dùng click thẻ
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [center, map]);
  return null;
}

export default function PropertyMap({ properties, selectedProperty, onSelectProperty }: PropertyMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-100 rounded-2xl dark:bg-zinc-900">
        <span className="text-zinc-500 animate-pulse font-medium">Đang tải bản đồ tương tác...</span>
      </div>
    );
  }

  // Tạo Custom Icon có MŨI TÊN CHỈ HƯỚNG BÊN DƯỚI (Pin Pointer) giúp xác định vị trí cực kỳ chính xác
  const createPriceMarkerIcon = (price: number, isSelected: boolean) => {
    return L.divIcon({
      className: 'custom-price-marker',
      html: `
        <div class="relative flex flex-col items-center transition-all duration-200 ${isSelected ? 'scale-110 z-[9999]' : ''}">
          <!-- Thẻ giá tiền -->
          <div class="flex items-center justify-center px-2.5 py-1.5 rounded-lg font-bold text-xs shadow-md border whitespace-nowrap transition-colors duration-200
            ${isSelected 
              ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-200' 
              : 'bg-white text-zinc-950 border-zinc-300 hover:bg-zinc-950 hover:text-white hover:border-zinc-950'
            }">
            ${price} tỷ
          </div>
          <!-- Mũi tên chỉ xuống dưới chỉ chính xác vào tọa độ -->
          <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] -mt-[1px] transition-colors duration-200
            ${isSelected 
              ? 'border-t-red-600' 
              : 'border-t-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]'
            }">
          </div>
        </div>
      `,
      iconSize: [80, 42],
      iconAnchor: [40, 36], // Đặt mốc chỉ ở chính giữa bên dưới mũi tên chỉ hướng
    });
  };

  // Tạo icon nhỏ hiển thị điểm tiện ích
  const createAmenityIcon = (type: string) => {
    let color = '#3b82f6'; // Xanh dương cho Trường học
    if (type === 'shopping') color = '#ec4899'; // Hồng cho Mua sắm
    if (type === 'hospital') color = '#ef4444'; // Đỏ cho Y tế
    if (type === 'park') color = '#10b981'; // Xanh lá cho Công viên
    
    return L.divIcon({
      className: 'custom-amenity-icon',
      html: `<div class="w-2.5 h-2.5 rounded-full border border-white shadow-sm" style="background-color: ${color};"></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5],
    });
  };

  // Lọc ra các tiện ích nằm trong bán kính 1.5km của căn hộ đang chọn
  const getNearbyAmenities = () => {
    if (!selectedProperty) return [];
    return HCMC_AMENITIES.map(amenity => {
      const distance = calculateDistance(
        selectedProperty.lat,
        selectedProperty.lng,
        amenity.lat,
        amenity.lng
      );
      return { ...amenity, distance };
    }).filter(amenity => amenity.distance <= 1500) // Bán kính 1.5km
      .sort((a, b) => a.distance - b.distance);
  };

  const nearbyAmenities = getNearbyAmenities();

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-inner border border-zinc-200 dark:border-zinc-800">
      <MapContainer
        center={selectedProperty ? [selectedProperty.lat, selectedProperty.lng] : DEFAULT_CENTER}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* VẼ BÁN KÍNH TIỆN ÍCH 1.5KM KHI CHỌN CĂN HỘ */}
        {selectedProperty && (
          <Circle
            center={[selectedProperty.lat, selectedProperty.lng]}
            radius={1500}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.04,
              weight: 1.5,
              dashArray: '6, 6'
            }}
          />
        )}

        {/* VẼ CÁC ĐIỂM TIỆN ÍCH XUNG QUANH TRONG BÁN KÍNH */}
        {selectedProperty && nearbyAmenities.map((amenity, idx) => (
          <Marker
            key={`amenity-${idx}`}
            position={[amenity.lat, amenity.lng]}
            icon={createAmenityIcon(amenity.type)}
          >
            <Tooltip direction="top" offset={[0, -5]} opacity={0.95}>
              <div className="px-1 py-0.5 font-sans">
                <span className="font-bold text-[10px] text-zinc-800">
                  {amenity.type === 'shopping' && '🛍️'}
                  {amenity.type === 'hospital' && '🏥'}
                  {amenity.type === 'school' && '🏫'}
                  {amenity.type === 'park' && '🌳'} {amenity.name}
                </span>
                <span className="block text-[9px] text-zinc-500 font-semibold mt-0.5">Khoảng cách: ~{amenity.distance.toFixed(0)}m</span>
              </div>
            </Tooltip>
          </Marker>
        ))}

        {/* Vẽ Marker cho từng bất động sản */}
        {properties.map((item) => {
          const isSelected = selectedProperty?.id === item.id;
          return (
            <Marker
              key={item.id}
              position={[item.lat, item.lng]}
              icon={createPriceMarkerIcon(item.price, isSelected)}
              eventHandlers={{
                click: () => onSelectProperty(item),
              }}
            >
              <Popup closeButton={false} offset={[0, -10]}>
                <div className="w-48 overflow-hidden rounded-lg font-sans">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-24 object-cover rounded-t-lg"
                  />
                  <div className="p-2">
                    <span className="inline-block px-2 py-0.5 mb-1 text-[10px] font-semibold bg-zinc-100 text-zinc-800 rounded dark:bg-zinc-800 dark:text-zinc-200">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-sm text-zinc-900 line-clamp-1 mb-0.5">{item.title}</h4>
                    <p className="text-zinc-500 text-[11px] mb-1 font-medium">{item.location}</p>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-100">
                      <span className="text-red-600 font-extrabold text-sm">{item.price} tỷ</span>
                      <span className="text-zinc-700 text-xs font-semibold">{item.area} m²</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Cập nhật góc nhìn bản đồ khi người dùng chọn nhà từ danh sách */}
        {selectedProperty && (
          <MapController center={[selectedProperty.lat, selectedProperty.lng]} />
        )}
      </MapContainer>
    </div>
  );
}
