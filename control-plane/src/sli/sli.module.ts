import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SliController } from './sli.controller';
import { SliService } from './sli.service';
import { SliEntity } from '../entities/sli.entity';
import { PrometheusValidationService } from '../services/prometheus-validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([SliEntity])],
  controllers: [SliController],
  providers: [SliService, PrometheusValidationService],
  exports: [SliService],
})
export class SliModule {}
