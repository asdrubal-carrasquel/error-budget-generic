import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EvaluationOrchestratorService } from './evaluation-orchestrator.service';

@ApiTags('Evaluation')
@Controller('evaluation')
export class EvaluationController {
  constructor(
    private readonly orchestratorService: EvaluationOrchestratorService,
  ) {}

  @Post('slo/:sloId')
  @ApiOperation({ summary: 'Evaluate a specific SLO' })
  async evaluateSlo(@Param('sloId') sloId: string) {
    return this.orchestratorService.evaluateSlo(sloId);
  }

  @Post('all')
  @ApiOperation({ summary: 'Evaluate all SLOs' })
  async evaluateAll() {
    return this.orchestratorService.evaluateAllSlos();
  }

  @Get('history/:sloId')
  @ApiOperation({ summary: 'Get evaluation history for a SLO' })
  async getHistory(
    @Param('sloId') sloId: string,
    @Query('limit') limit?: number,
  ) {
    return this.orchestratorService.getEvaluationHistory(sloId, limit || 100);
  }
}
