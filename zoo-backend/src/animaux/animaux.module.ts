import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimauxController } from './animaux.controller';
import { AnimauxService } from './animaux.service';
import { Animal } from './entities/animal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Animal])],
  controllers: [AnimauxController],
  providers: [AnimauxService],
})
export class AnimauxModule {}
