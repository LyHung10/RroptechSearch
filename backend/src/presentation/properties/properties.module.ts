import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyDocument, PropertySchema } from '../../infrastructure/properties/persistence/mongoose/property.schema';
import { PROPERTY_REPOSITORY_TOKEN } from '../../domain/properties/repositories/property.repository.interface';
import { MongoosePropertyRepository } from '../../infrastructure/properties/persistence/mongoose/mongoose-property.repository';
import { CreatePropertyUseCase } from '../../application/properties/use-cases/create-property.use-case';
import { ListPropertiesUseCase } from '../../application/properties/use-cases/list-properties.use-case';
import { PropertiesController } from './controllers/properties.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PropertyDocument.name, schema: PropertySchema }]),
  ],
  controllers: [PropertiesController],
  providers: [
    {
      provide: PROPERTY_REPOSITORY_TOKEN,
      useClass: MongoosePropertyRepository,
    },
    CreatePropertyUseCase,
    ListPropertiesUseCase,
  ],
  exports: [PROPERTY_REPOSITORY_TOKEN, CreatePropertyUseCase, ListPropertiesUseCase],
})
export class PropertiesModule {}
