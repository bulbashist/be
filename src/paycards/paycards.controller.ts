import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PaycardsService } from './paycards.service';
import { CreatePaycardDto } from './dto/create-paycard.dto';

@Controller('paycards')
export class PaycardsController {
  constructor(private readonly paycardsService: PaycardsService) {}

  @Post()
  create(@Body() createPaycardDto: CreatePaycardDto) {
    return this.paycardsService.create(createPaycardDto);
  }

  @Get(':id')
  findAll(@Param('id', ParseIntPipe) userId: number) {
    return this.paycardsService.findUsersAll(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paycardsService.remove(+id);
  }
}
