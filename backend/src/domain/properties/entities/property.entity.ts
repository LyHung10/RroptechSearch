import { Entity } from '../../../shared/domain/entity.base';

export interface PropertyProps {
  title: string;
  description: string;
  price: number; // Tỷ VND
  area: number;  // m²
  bedrooms: number;
  bathrooms: number;
  lat: number;   // Vĩ độ
  lng: number;   // Kinh độ
  image: string; // Ảnh minh họa
  category: string; // Chung cư, Nhà riêng, Biệt thự, Đất nền
  location: string; // Địa chỉ rút gọn (ví dụ: Cầu Giấy, Hà Nội)
}

export class Property extends Entity<string> {
  private _props: PropertyProps;

  constructor(
    id: string,
    props: PropertyProps,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date,
  ) {
    super(id, createdAt, updatedAt, deletedAt);
    this._props = props;
  }

  get title(): string {
    return this._props.title;
  }

  get description(): string {
    return this._props.description;
  }

  get price(): number {
    return this._props.price;
  }

  get area(): number {
    return this._props.area;
  }

  get bedrooms(): number {
    return this._props.bedrooms;
  }

  get bathrooms(): number {
    return this._props.bathrooms;
  }

  get lat(): number {
    return this._props.lat;
  }

  get lng(): number {
    return this._props.lng;
  }

  get image(): string {
    return this._props.image;
  }

  get category(): string {
    return this._props.category;
  }

  get location(): string {
    return this._props.location;
  }

  // Phương thức cập nhật thông tin nghiệp vụ
  public updateInfo(newProps: Partial<PropertyProps>): void {
    this._props = {
      ...this._props,
      ...newProps,
    };
    this.markAsUpdated();
  }
}
