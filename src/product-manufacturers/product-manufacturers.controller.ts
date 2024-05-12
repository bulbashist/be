import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductManufacturersService } from './product-manufacturers.service';
import { CreateProductManufacturerDto } from './dto/create-product-manufacturer.dto';
import { UpdateProductManufacturerDto } from './dto/update-product-manufacturer.dto';

@Controller('product-manufacturers')
export class ProductManufacturersController {
  constructor(
    private readonly productManufacturersService: ProductManufacturersService,
  ) {}

  @Post()
  create(@Body() createProductManufacturerDto: CreateProductManufacturerDto) {
    return this.productManufacturersService.create(
      createProductManufacturerDto,
    );
  }

  @Get()
  async findAll() {
    return await this.productManufacturersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productManufacturersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductManufacturerDto: UpdateProductManufacturerDto,
  ) {
    return this.productManufacturersService.update(
      +id,
      updateProductManufacturerDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productManufacturersService.remove(+id);
  }
}
