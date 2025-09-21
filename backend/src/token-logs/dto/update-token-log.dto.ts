import { PartialType } from '@nestjs/mapped-types';
import { CreateTokenLogDto } from './create-token-log.dto';

export class UpdateTokenLogDto extends PartialType(CreateTokenLogDto) {}
