import { PartialType } from '@nestjs/mapped-types';
import { CreatePaycardDto } from './create-paycard.dto';

export class UpdatePaycardDto extends PartialType(CreatePaycardDto) {}
