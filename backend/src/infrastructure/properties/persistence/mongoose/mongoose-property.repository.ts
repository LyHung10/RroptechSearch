import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPropertyRepository } from '../../../../domain/properties/repositories/property.repository.interface';
import { Property, PropertyProps } from '../../../../domain/properties/entities/property.entity';
import { PropertyDocument } from './property.schema';

@Injectable()
export class MongoosePropertyRepository implements IPropertyRepository, OnModuleInit {
  constructor(
    @InjectModel(PropertyDocument.name)
    private readonly propertyModel: Model<PropertyDocument>,
  ) { }

  // Tự động seed dữ liệu mẫu khi module khởi tạo
  async onModuleInit() {
    // Để cập nhật sang khu vực TP. HCM, ta xóa sạch các dữ liệu cũ trước
    await this.propertyModel.deleteMany({});
    console.log('--- ĐÃ RESET DATABASE: ĐANG TỰ ĐỘNG SEED DỮ LIỆU BẤT ĐỘNG SẢN VIP TẠI TP. HỒ CHÍ MINH ---');

    const sampleProperties: PropertyProps[] = [
      {
        title: 'Căn Hộ Landmark 81 - View Sông Sài Gòn Trọn Vẹn',
        description: 'Căn hộ chung cư siêu cao cấp tại tòa nhà cao nhất Việt Nam - Landmark 81. Thiết kế kính Low-E cản nhiệt, nội thất đẳng cấp thượng lưu, view trọn vẹn sông Sài Gòn và công viên 14ha rộng lớn.',
        price: 9.8,
        area: 108,
        bedrooms: 3,
        bathrooms: 2,
        lat: 10.7951119,
        lng: 106.7195211,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        category: 'Chung cư',
        location: 'Bình Thạnh, TP. HCM',
      },
      {
        title: 'Siêu Căn Hộ Vinhomes Golden River - Ba Son Quận 1',
        description: 'Tọa lạc tại vị trí kim cương trung tâm Quận 1 bên bờ sông Sài Gòn. Căn hộ bàn giao cao cấp, lát đá Marble tự nhiên, lắp đặt kính Low-E, thiết bị bếp cao cấp của Đức và smarthome hiện đại.',
        price: 12.5,
        area: 85,
        bedrooms: 2,
        bathrooms: 2,
        lat: 10.7870345,
        lng: 106.7105934,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        category: 'Chung cư',
        location: 'Quận 1, TP. HCM',
      },
      {
        title: 'Căn Hộ View Sông Trực Diện Empire City - Thủ Thiêm',
        description: 'Căn hộ tầng trung tháp Linden Residences tại dự án Empire City Thủ Thiêm. Ban công rộng ngắm trọn vẹn pháo hoa Quận 1. Đầy đủ tiện ích hồ bơi tràn bờ, rạp chiếu phim, khu vui chơi.',
        price: 15.8,
        area: 127,
        bedrooms: 3,
        bathrooms: 2,
        lat: 10.7620,
        lng: 106.7225,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        category: 'Chung cư',
        location: 'Thủ Đức, TP. HCM',
      },
      {
        title: 'Biệt Thự Đơn Lập Lâu Đài Chateau - Phú Mỹ Hưng Q7',
        description: 'Biệt thự Chateau Phú Mỹ Hưng đẳng cấp bậc nhất Sài Gòn dành cho giới thượng lưu. Thiết kế phong cách lâu đài cổ điển nguy nga, sân vườn rộng, hồ cá sát sông thoáng mát. An ninh 24/7.',
        price: 49.0, // Đặt dưới 50 tỷ để nằm trong bộ lọc mặc định dễ hiển thị
        area: 310,
        bedrooms: 5,
        bathrooms: 6,
        lat: 10.7180,
        lng: 106.7090,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        category: 'Biệt thự',
        location: 'Quận 7, TP. HCM',
      },
      {
        title: 'Nhà Phố Kinh Doanh Mặt Tiền Cư Xá Đô Thành Q3',
        description: 'Nhà riêng phố cư xá Đô Thành, Quận 3 sầm uất. Khu vực đắc địa, ô tô tránh nhau thoải mái, thích hợp mở văn phòng, spa hoặc kinh doanh. Nhà xây mới 4 tầng kiên cố, gỗ đỏ cao cấp.',
        price: 16.8,
        area: 65,
        bedrooms: 4,
        bathrooms: 4,
        lat: 10.7745,
        lng: 106.6805,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        category: 'Nhà riêng',
        location: 'Quận 3, TP. HCM',
      },
      {
        title: 'Đất Nền Phân Lô Dự Án An Phú An Khánh Quận 2',
        description: 'Mảnh đất vuông vắn tuyệt đẹp tại khu đô thị cao cấp An Phú An Khánh Q2. Vị trí đối diện công viên cây xanh, cơ sở hạ tầng đã hoàn thiện, khu dân trí cao, an ninh nghiêm ngặt.',
        price: 26.5,
        area: 150,
        bedrooms: 0,
        bathrooms: 0,
        lat: 10.7932,
        lng: 106.7455,
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        category: 'Đất nền',
        location: 'Thủ Đức, TP. HCM',
      },
      {
        title: 'Căn Hộ Diamond Island Tháp Maldives - Diamond View',
        description: 'Căn hộ tại Đảo Kim Cương Diamond Island, tòa Maldives. View sông Sài Gòn 3 mặt cực đẹp, căn hộ ngập tràn gió tự nhiên. Hệ thống tiện ích chuẩn resort: hồ bơi 2300m2, taxi nước.',
        price: 8.9,
        area: 96,
        bedrooms: 2,
        bathrooms: 2,
        lat: 10.7710,
        lng: 106.7532,
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
        category: 'Chung cư',
        location: 'Thủ Đức, TP. HCM',
      },
      {
        title: 'Căn Hộ Masteri Thảo Điền - Tầm Nhìn Xa Lộ Hà Nội',
        description: 'Căn hộ chung cư trung tâm Thảo Điền Quận 2. Gần ga Metro Bến Thành - Suối Tiên sắp vận hành, giao thông thuận tiện. Đầy đủ tiện ích trung tâm thương mại Vincom Mega Mall Thảo Điền.',
        price: 4.6,
        area: 72,
        bedrooms: 2,
        bathrooms: 2,
        lat: 10.8012,
        lng: 106.7523,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        category: 'Chung cư',
        location: 'Thủ Đức, TP. HCM',
      },
      {
        title: 'Căn Hộ Hạng Sang The Metropole Thủ Thiêm',
        description: 'Dự án căn hộ cao cấp ngay chân cầu Thủ Thiêm 2 kết nối trực tiếp Quận 1. Thiết kế căn hộ thông minh tối ưu diện tích đón ánh sáng tự nhiên. View sông Sài Gòn lãng mạn.',
        price: 19.5,
        area: 115,
        bedrooms: 3,
        bathrooms: 2,
        lat: 10.7788,
        lng: 106.7162,
        image: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80',
        category: 'Chung cư',
        location: 'Thủ Đức, TP. HCM',
      },
      {
        title: 'Biệt Thự Sân Vườn Ven Sông Thảo Điền Q2',
        description: 'Siêu phẩm biệt thự ven sông Sài Gòn, khu Thảo Điền yên tĩnh biệt lập. Hồ bơi lớn ngoài trời, sân vườn trồng nhiều hoa cỏ mát mắt. Nội thất gỗ óc chó cao cấp sang trọng.',
        price: 95.0, // Căn cực khủng > 50 tỷ để test tính năng maxPrice
        area: 450,
        bedrooms: 6,
        bathrooms: 6,
        lat: 10.8065,
        lng: 106.7325,
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
        category: 'Biệt thự',
        location: 'Thủ Đức, TP. HCM',
      },
      {
        title: 'Nhà Phố Kinh Doanh Phan Xích Long Phú Nhuận',
        description: 'Nhà riêng ngay trục đường sầm uất nhất Phú Nhuận - Phan Xích Long. Thích hợp kinh doanh ẩm thực, quán cafe hoặc cho thuê làm văn phòng thương mại. Mặt tiền thoáng, lề đường rộng.',
        price: 18.5,
        area: 60,
        bedrooms: 3,
        bathrooms: 3,
        lat: 10.7964,
        lng: 106.6872,
        image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80',
        category: 'Nhà riêng',
        location: 'Phú Nhuận, TP. HCM',
      },
      {
        title: 'Căn Hộ Sky Garden 3 - Phú Mỹ Hưng Quận 7',
        description: 'Căn hộ chung cư ấm cúng tại Sky Garden 3 Phú Mỹ Hưng. Khu phố sầm uất với nhiều siêu thị, nhà hàng Hàn Quốc, trường học quốc tế. Thích hợp cho gia đình trẻ sinh sống.',
        price: 3.4,
        area: 74,
        bedrooms: 2,
        bathrooms: 2,
        lat: 10.7290,
        lng: 106.7020,
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        category: 'Chung cư',
        location: 'Quận 7, TP. HCM',
      },
      {
        title: 'Nhà Riêng Hẻm Xe Hơi CMT8 Quận 10',
        description: 'Nhà riêng hẻm xe hơi tránh nhau đường Cách Mạng Tháng 8. Thiết kế kiến trúc hiện đại 3 tầng, sân thượng rộng rãi thoáng gió. Khu dân cư an ninh yên tĩnh, gần chợ Hòa Hưng.',
        price: 8.7,
        area: 52,
        bedrooms: 3,
        bathrooms: 3,
        lat: 10.7815,
        lng: 106.6698,
        image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=800&q=80',
        category: 'Nhà riêng',
        location: 'Quận 10, TP. HCM',
      }
    ];

    for (const item of sampleProperties) {
      await this.propertyModel.create(item);
    }
    console.log('--- SEED DỮ LIỆU BẤT ĐỘNG SẢN TP. HỒ CHÍ MINH HOÀN TẤT THÀNH CÔNG! ---');
  }

  async findAll(): Promise<Property[]> {
    const docs = await this.propertyModel.find().exec();
    return docs.map(doc => this.mapToDomain(doc));
  }

  async findById(id: string): Promise<Property | null> {
    const doc = await this.propertyModel.findById(id).exec();
    if (!doc) return null;
    return this.mapToDomain(doc);
  }

  async create(property: Property): Promise<Property> {
    const doc = new this.propertyModel({
      _id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      area: property.area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      lat: property.lat,
      lng: property.lng,
      image: property.image,
      category: property.category,
      location: property.location,
    });
    const saved = await doc.save();
    return this.mapToDomain(saved);
  }

  private mapToDomain(doc: PropertyDocument): Property {
    return new Property(
      String(doc._id),
      {
        title: doc.title,
        description: doc.description,
        price: doc.price,
        area: doc.area,
        bedrooms: doc.bedrooms,
        bathrooms: doc.bathrooms,
        lat: doc.lat,
        lng: doc.lng,
        image: doc.image,
        category: doc.category,
        location: doc.location,
      },
      (doc as any).createdAt,
      (doc as any).updatedAt,
    );
  }
}
