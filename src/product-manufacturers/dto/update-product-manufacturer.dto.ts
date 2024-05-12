import { PartialType } from '@nestjs/mapped-types';
import { CreateProductManufacturerDto } from './create-product-manufacturer.dto';

export class UpdateProductManufacturerDto extends PartialType(CreateProductManufacturerDto) {}
