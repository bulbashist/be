import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Server, Socket } from 'socket.io';
import { GetCommentDto } from './dto/get-comment.dto';
import { UseGuards } from '@nestjs/common/decorators';
import { DeleteGuard } from './guards/delete.guard';

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
export class CommentsGateway {
  @WebSocketServer()
  private _server: Server;

  constructor(private readonly commentsService: CommentsService) {}

  private parseCookieHeader(cookieHeader) {
    const cookies = {};
    if (cookieHeader) {
      const cookieList = cookieHeader.split(';');
      cookieList.forEach((cookie) => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = value;
      });
    }
    return cookies;
  }

  @SubscribeMessage('createComment')
  async create(
    @MessageBody() dto: CreateCommentDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.commentsService
      .create(dto)
      .then((res) => this._server.emit('createComment', new GetCommentDto(res)))
      .catch(() =>
        socket.emit('createComment', {
          err: true,
          msg: 'err_duplicate_comment',
        }),
      );
  }

  @SubscribeMessage('removeComment')
  @UseGuards(DeleteGuard)
  async remove(@MessageBody() id: number) {
    this.commentsService
      .remove(id)
      .then(() => this._server.emit('removeComment', id))
      .catch(console.log);
  }
}
