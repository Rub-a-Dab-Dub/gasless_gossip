import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pseudonym } from './entities/pseudonym.entity';
import { PseudonymsService } from './services/pseudonyms.service';
import { PseudonymsController } from './controllers/pseudonyms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pseudonym])],
  controllers: [PseudonymsController],
  providers: [PseudonymsService],
  exports: [PseudonymsService],
})
export class PseudonymsModule {}


