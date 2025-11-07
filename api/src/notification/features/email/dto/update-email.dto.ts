import { PartialType } from '@nestjs/mapped-types';
import { SendVerifyUserEmailDto } from './create-email.dto';

export class UpdateEmailDto extends PartialType(SendVerifyUserEmailDto) {}
