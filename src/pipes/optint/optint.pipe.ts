import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseOptIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value ? +value : undefined;
  }
}
