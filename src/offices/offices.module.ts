import { Module } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { OfficesController } from './offices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from './entities/office.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Office])],
  controllers: [OfficesController],
  providers: [OfficesService],
})
export class OfficesModule {}
