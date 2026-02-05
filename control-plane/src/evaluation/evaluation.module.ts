import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationController } from './evaluation.controller';
import { EvaluationOrchestratorService } from './evaluation-orchestrator.service';
import { PolicyEngineService } from './policy-engine.service';
import { EvaluationHistoryEntity } from '../entities/evaluation-history.entity';
import { SloModule } from '../slo/slo.module';
import { PolicyModule } from '../policy/policy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EvaluationHistoryEntity]),
    SloModule,
    PolicyModule,
  ],
  controllers: [EvaluationController],
  providers: [EvaluationOrchestratorService, PolicyEngineService],
  exports: [EvaluationOrchestratorService],
})
export class EvaluationModule {}
