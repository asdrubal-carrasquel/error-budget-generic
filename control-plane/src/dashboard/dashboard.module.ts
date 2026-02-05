import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SloModule } from '../slo/slo.module';
import { EvaluationModule } from '../evaluation/evaluation.module';

@Module({
  imports: [SloModule, EvaluationModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
