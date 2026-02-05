import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SloController } from './slo.controller';
import { SloService } from './slo.service';
import { SloEntity } from '../entities/slo.entity';
import { SliModule } from '../sli/sli.module';

@Module({
  imports: [TypeOrmModule.forFeature([SloEntity]), SliModule],
  controllers: [SloController],
  providers: [SloService],
  exports: [SloService],
})
export class SloModule {}
