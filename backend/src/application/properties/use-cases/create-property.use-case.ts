import { Inject, Injectable } from '@nestjs/common';
import { PROPERTY_REPOSITORY_TOKEN } from '../../../domain/properties/repositories/property.repository.interface';
import type { IPropertyRepository } from '../../../domain/properties/repositories/property.repository.interface';
import { Property, PropertyProps } from '../../../domain/properties/entities/property.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY_TOKEN)
    private readonly propertyRepository: IPropertyRepository,
  ) {}

  async execute(props: PropertyProps): Promise<Property> {
    const propertyId = uuidv4();
    const property = new Property(propertyId, props);
    return await this.propertyRepository.create(property);
  }
}
