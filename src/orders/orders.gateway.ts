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

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: ['http://localhost:3000', 'https://application-ld69.onrender.com'],
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
    return this.ordersService.create(createOrderDto);
  }

  @SubscribeMessage('findAllOrders')
  findAll(@MessageBody() page = 1, @ConnectedSocket() client: Socket) {
    this.ordersService
      .findAll()
      .then((res) => client.emit('findAllOrders', res));
  }

  @SubscribeMessage('findOneOrder')
  findOne(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
    this.ordersService
      .findOne(id)
      .then((res) => client.emit('findOneOrder', res));
  }

  async update(@MessageBody() { id, status }: UpdateOrderDto) {
    const payload = await this.ordersService.update(id, status);
    this.server.to('ADV_USERS').emit('updateOrder', payload);
  }

  @SubscribeMessage('removeOrder')
  remove(@MessageBody() id: number) {
    return this.ordersService.remove(id);
  }
}
