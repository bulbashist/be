import { Module } from '@nestjs/common';
import { PaycardsService } from './paycards.service';
import { PaycardsController } from './paycards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayCard } from './entities/paycard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PayCard])],
  controllers: [PaycardsController],
  providers: [PaycardsService],
})
export class PaycardsModule {}
