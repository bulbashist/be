import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Server, Socket } from 'socket.io';
import { createTransport } from 'nodemailer';

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: [
      'http://localhost:3000',
      'https://fe-8big.onrender.com',
      process.env.CLIENT_APP,
    ],
  },
})
export class OrdersGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private readonly ordersService: OrdersService) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    if (token) {
      try {
        client.join('ADV_USERS');
        // const { role } = this.jwtService.verify(token);
        // if (role > 1) {
        // client.join('ADV_USERS');
        // }
      } catch {}
    }
  }

  @SubscribeMessage('createOrder')
  create(@MessageBody() createOrderDto: CreateOrderDto) {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'nbulbashist@gmail.com',
        pass: 'abzm lrmh ctpr rwrt',
      },
    });

    const mailOptions = {
      from: 'nbulbashist@gmail.com',
      to: '',
      subject: 'New order',
      text: '',
    };

    createOrderDto.products.forEach((p) => {
      mailOptions.to = p.product.seller.login;
      mailOptions.text = `
      Product #${p.product.id} (${p.product.name}) was ordered.
      Amount: ${p.count}. 
      `;
      transporter.sendMail(mailOptions).catch(console.log);
    });

    this.ordersService
      .create(createOrderDto)
      .then((res) => this.server.to('ADV_USERS').emit('createOrder', res));
  }

  @SubscribeMessage('findAllOrders')
  findAll(@MessageBody() page = 1, @ConnectedSocket() client: Socket) {
    this.ordersService
      .findAll(page)
      .then((res) => client.emit('findAllOrders', res));
  }

  @SubscribeMessage('findBySeller')
  findBySeller(@MessageBody() sellerId = 1, @ConnectedSocket() client: Socket) {
    this.ordersService
      .findBySeller(sellerId)
      .then((res) => client.emit('findBySeller', res));
  }

  @SubscribeMessage('findOneOrder')
  findOne(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    this.ordersService
      .findOne(id)
      .then((res) => client.emit('findOneOrder', res));
  }

  @SubscribeMessage('updateOrder')
  async update(@MessageBody() dto: UpdateOrderDto) {
    const payload = await this.ordersService.update(dto);
    this.server.to('ADV_USERS').emit('updateOrder', payload);
  }

  @SubscribeMessage('removeOrder')
  remove(@MessageBody() id: number) {
    this.ordersService
      .remove(id)
      .then(() => this.server.to('ADV_USERS').emit('removeOrder', id));
  }
}
