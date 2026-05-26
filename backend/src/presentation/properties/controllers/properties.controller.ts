import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { CreatePropertyUseCase } from '../../../application/properties/use-cases/create-property.use-case';
import { ListPropertiesUseCase } from '../../../application/properties/use-cases/list-properties.use-case';
import { type CreatePropertyDto, CreatePropertySchema } from '../dtos/create-property.dto';
import { ZodValidationPipe } from '../../../shared/presentation/pipes/zod-validation.pipe';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly createPropertyUseCase: CreatePropertyUseCase,
    private readonly listPropertiesUseCase: ListPropertiesUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreatePropertySchema))
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    const property = await this.createPropertyUseCase.execute(createPropertyDto);
    return this.serializeProperty(property);
  }

  @Get()
  async findAll() {
    const list = await this.listPropertiesUseCase.execute();
    return list.map(item => this.serializeProperty(item));
  }

  // Hàm chuyển đổi Entity thành Plain Object để tránh lỗi chuyển đổi JSON của NestJS đối với Getters
  private serializeProperty(property: any) {
    return {
      id: property.id,
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
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };
  }
}
