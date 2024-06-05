import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Jwt } from 'src/jwt/jwt.decorator';
import { AccessToken } from 'src/utility/types';
import { PostGuard } from './guards/post.guard';
import { DeleteGuard } from './guards/delete.guard';
import { ParseOptIntPipe } from 'src/pipes/optint/optint.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(PostGuard)
  async create(
    @Body() createProductDto: CreateProductDto,
    @Jwt() token: AccessToken,
  ) {
    return this.productsService.create(createProductDto, token.id).catch(() => {
      throw new BadRequestException();
    });
  }

  @Get()
  async findAll(
    @Query('seller', ParseOptIntPipe) sellerId: number,
    @Query('category') categoryName: string,
    @Query('page', ParseOptIntPipe) page: number,
    @Query('sort', ParseOptIntPipe) sort: number,
  ) {
    if (sellerId) {
      return this.productsService.findBySeller(+sellerId, page, sort);
    } else if (categoryName) {
      return this.productsService.findByCategory(categoryName, page, sort);
    } else {
      return this.productsService.findAll(page, sort);
    }
  }

  @Get('/search')
  async search(
    @Query('text') text: string,
    @Query('page', ParseOptIntPipe) page: number,
  ) {
    return await this.productsService.findByText(text, page);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id).catch(() => {
      throw new NotFoundException();
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(DeleteGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id).catch(() => {
      throw new BadRequestException('This product is a part of current orders');
    });
  }
}
