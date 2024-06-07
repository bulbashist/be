import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { Message } from './entites/mesage.entity';
import { Office } from './offices/entities/office.entity';
import { OrderStatus } from './orders/entities/order-status.entity';
import { Order, ProductsToOrders } from './orders/entities/order.entity';
import { ProductCategory } from './product-categories/entities/product-category.entity';
import { ProductManufacturer } from './product-manufacturers/entities/product-manufacturer.entity';
import { ProductPhoto } from './products/entities/product-photo.entity';
import { Product } from './products/entities/product.entity';
import { UserRole } from './users/entities/user-role.entity';
import { ProductsModule } from './products/products.module';
import { OfficesModule } from './offices/offices.module';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entities/comment.entity';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { OrdersModule } from './orders/orders.module';
import { ProductManufacturersModule } from './product-manufacturers/product-manufacturers.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DBHOST,
      port: +process.env.DBPORT,
      username: process.env.DBUSER,
      password: process.env.DBPASS,
      database: process.env.DBNAME,
      keepConnectionAlive: true,
      entities: [
        User,
        // Message,
        Office,
        OrderStatus,
        Order,
        ProductCategory,
        ProductManufacturer,
        ProductPhoto,
        ProductsToOrders,
        Product,
        UserRole,
        Comment,
      ],
      synchronize: true,
    }),
    AuthModule,
    ProductsModule,
    OrdersModule,
    OfficesModule,
    CommentsModule,
    ProductCategoriesModule,
    ProductManufacturersModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
