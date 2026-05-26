import { Property } from '../entities/property.entity';

export interface IPropertyRepository {
  findAll(): Promise<Property[]>;
  findById(id: string): Promise<Property | null>;
  create(property: Property): Promise<Property>;
}

export const PROPERTY_REPOSITORY_TOKEN = 'IPropertyRepository';
