import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SloService } from '../slo/slo.service';
import { PolicyEngineService } from './policy-engine.service';
import { EvaluationHistoryEntity } from '../entities/evaluation-history.entity';

/**
 * Evaluation Orchestrator Service
 * 
 * SRE NOTE: This service orchestrates the evaluation process:
 * 1. Retrieves SLO configuration from database
 * 2. Calls Evaluation Engine to calculate SLI and evaluate SLO
 * 3. Applies operational policies based on Error Budget
 * 4. Stores evaluation history
 * 
 * This is the core integration point between Control Plane and Evaluation Engine.
 */
@Injectable()
export class EvaluationOrchestratorService {
  private readonly evaluationEngineUrl: string;

  constructor(
    @InjectRepository(EvaluationHistoryEntity)
    private historyRepository: Repository<EvaluationHistoryEntity>,
    private sloService: SloService,
    private policyEngine: PolicyEngineService,
    private configService: ConfigService,
  ) {
    this.evaluationEngineUrl = this.configService.get('EVALUATION_ENGINE_URL', 'http://localhost:8080');
  }

  /**
   * Evaluate a specific SLO
   */
  async evaluateSlo(sloId: string): Promise<any> {
    // Get SLO configuration
    const slo = await this.sloService.findOne(sloId);
    const sli = slo.sli;

    // Prepare request for Evaluation Engine
    const evaluationRequest = {
      sli: {
        name: sli.name,
        type: sli.type,
        goodQuery: sli.goodQuery,
        totalQuery: sli.totalQuery,
        window: sli.window,
      },
      sloTarget: slo.target,
      sloWindow: slo.window,
      sla: slo.slas && slo.slas.length > 0 ? {
        slaTarget: slo.slas[0].target,
        penalties: slo.slas[0].penalties.map(p => ({
          threshold: p.threshold,
          impact: p.impact,
        })),
      } : null,
    };

    // Call Evaluation Engine
    const response = await axios.post(
      `${this.evaluationEngineUrl}/api/evaluation/slo`,
      evaluationRequest,
      { timeout: 30000 }
    );

    const evaluationResult = response.data;

    // Apply operational policy based on Error Budget remaining
    const errorBudgetRemainingPercentage = evaluationResult.errorBudgetRemainingPercentage * 100;
    const appliedPolicy = await this.policyEngine.applyPolicy(errorBudgetRemainingPercentage);

    // Store evaluation history
    await this.storeEvaluationHistory(sloId, evaluationResult, appliedPolicy);

    return {
      ...evaluationResult,
      appliedPolicy: appliedPolicy?.action || 'UNKNOWN',
      policyDescription: appliedPolicy?.description || null,
    };
  }

  /**
   * Evaluate all SLOs
   */
  async evaluateAllSlos(): Promise<any[]> {
    const slos = await this.sloService.findAll();
    const results = await Promise.all(
      slos.map(slo => this.evaluateSlo(slo.id).catch(error => ({
        sloId: slo.id,
        error: error.message,
      })))
    );
    return results;
  }

  /**
   * Store evaluation result in history
   */
  private async storeEvaluationHistory(
    sloId: string,
    evaluationResult: any,
    appliedPolicy: any,
  ): Promise<void> {
    const history = this.historyRepository.create({
      sloId,
      sliValue: evaluationResult.sliValue,
      errorBudgetRemaining: evaluationResult.errorBudgetRemaining,
      burnRate: evaluationResult.burnRate,
      sloMet: evaluationResult.sloMet,
      slaMet: evaluationResult.slaMet,
      appliedPolicy: appliedPolicy?.action || 'UNKNOWN',
    });

    await this.historyRepository.save(history);
  }

  /**
   * Get evaluation history for a SLO
   */
  async getEvaluationHistory(sloId: string, limit: number = 100): Promise<EvaluationHistoryEntity[]> {
    return this.historyRepository.find({
      where: { sloId },
      order: { evaluatedAt: 'DESC' },
      take: limit,
    });
  }
}
