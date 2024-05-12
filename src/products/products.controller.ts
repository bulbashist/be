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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Jwt } from 'src/jwt/jwt.decorator';
import { AccessToken } from 'src/utility/types';
import { UserRights } from 'src/users/entities/rights';
import { PostGuard } from './guards/post.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(PostGuard)
  async create(
    @Body() createProductDto: CreateProductDto,
    @Jwt() token: AccessToken,
  ) {
    if (token.rights >= UserRights.Seller) {
      return await this.productsService.create(createProductDto, token.id);
    }
  }

  @Get()
  async findAll(
    @Query('seller') sellerId: string,
    @Query('category') categoryName: string,
    @Query('page', ParseIntPipe) page: number,
  ) {
    if (sellerId) {
      return this.productsService.findBySeller(+sellerId, page);
    } else if (categoryName) {
      return this.productsService.findByCategory(categoryName, page);
    } else {
      return await this.productsService.findAll(page);
    }
  }

  @Get('/search')
  async search(@Query('text') text: string) {
    return await this.productsService.findByText(text);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
