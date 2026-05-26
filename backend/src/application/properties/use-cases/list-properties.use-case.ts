import { Inject, Injectable } from '@nestjs/common';
import { PROPERTY_REPOSITORY_TOKEN } from '../../../domain/properties/repositories/property.repository.interface';
import type { IPropertyRepository } from '../../../domain/properties/repositories/property.repository.interface';
import { Property } from '../../../domain/properties/entities/property.entity';

@Injectable()
export class ListPropertiesUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY_TOKEN)
    private readonly propertyRepository: IPropertyRepository,
  ) {}

  async execute(): Promise<Property[]> {
    return await this.propertyRepository.findAll();
  }
}
