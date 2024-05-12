import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/entities/review.entity';
import { User } from './users/entities/user.entity';
import { TagsModule } from './tags/tags.module';
import { ConfigModule } from '@nestjs/config';
import { Tag } from './tags/entities/tag.entity';
import { AuthModule } from './auth/auth.module';
import { Message } from './entites/mesage.entity';
import { Office } from './offices/entities/office.entity';
import { OrderStatus } from './orders/entities/order-status.entity';
import { Order, ProductsToOrders } from './orders/entities/order.entity';
import { PayCard } from './paycards/entities/paycard.entity';
import { ProductCategory } from './product-categories/entities/product-category.entity';
import { ProductManufacturer } from './product-manufacturers/entities/product-manufacturer.entity';
import { ProductPhoto } from './products/entities/product-photo.entity';
import { Product } from './products/entities/product.entity';
import { Transaction } from './transactions/entities/transaction.entity';
import { UserRole } from './users/entities/user-role.entity';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { OfficesModule } from './offices/offices.module';
import { PaycardsModule } from './paycards/paycards.module';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entities/comment.entity';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { Seller } from './users/entities/seller.entity';
import { OrdersModule } from './orders/orders.module';
import { ProductManufacturersModule } from './product-manufacturers/product-manufacturers.module';

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
      poolSize: 10,
      keepConnectionAlive: true,
      entities: [
        User,
        Review,
        Tag,
        Message,
        Office,
        OrderStatus,
        Order,
        PayCard,
        ProductCategory,
        ProductManufacturer,
        ProductPhoto,
        ProductsToOrders,
        Product,
        Transaction,
        UserRole,
        Comment,
        Seller,
      ],
      synchronize: true,
    }),
    ReviewsModule,
    TagsModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    TransactionsModule,
    OfficesModule,
    PaycardsModule,
    CommentsModule,
    ProductCategoriesModule,
    ProductManufacturersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
