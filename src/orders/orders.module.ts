import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersGateway } from './orders.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrdersGateway, OrdersService],
})
export class OrdersModule {}
