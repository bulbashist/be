import { WriteStream, createWriteStream } from 'fs';
import { EOL } from 'os';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { UpdateOrderDto } from 'src/orders/dto/update-order.dto';

export class Logger {
  private _wstream: WriteStream;

  constructor() {
    this._wstream = createWriteStream('', { flags: 'a+' });
  }

  public log() {
    this._wstream.write('log' + EOL);
  }

  public logNewOrder(dto: CreateOrderDto) {
    const msg = `${dto.date}: Order #${dto.id} was ordered by user (id#${dto.user.id})`;
    this._wstream.write(msg + EOL);
  }

  public logOrderUpdate(dto: UpdateOrderDto) {
    const msg = `${new Date(Date.now()).toISOString()}: Order #${
      dto.id
    } was updated`;
    this._wstream.write(msg + EOL);
  }
}
