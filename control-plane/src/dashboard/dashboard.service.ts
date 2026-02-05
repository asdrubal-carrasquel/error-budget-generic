import { Injectable } from '@nestjs/common';
import { SloService } from '../slo/slo.service';
import { EvaluationOrchestratorService } from '../evaluation/evaluation-orchestrator.service';

/**
 * Dashboard Service
 * 
 * SRE NOTE: This service aggregates data for the dashboard display.
 * It provides a unified view of service status, Error Budget, and policies.
 */
@Injectable()
export class DashboardService {
  constructor(
    private sloService: SloService,
    private evaluationService: EvaluationOrchestratorService,
  ) {}

  /**
   * Get dashboard data for all services
   */
  async getDashboardData() {
    const slos = await this.sloService.findAll();
    
    // Evaluate all SLOs to get current status
    const evaluations = await Promise.all(
      slos.map(async (slo) => {
        try {
          const evaluation = await this.evaluationService.evaluateSlo(slo.id);
          return {
            sloId: slo.id,
            sloName: slo.sli.name,
            sloTarget: slo.target,
            ...evaluation,
          };
        } catch (error) {
          return {
            sloId: slo.id,
            sloName: slo.sli.name,
            error: error.message,
          };
        }
      })
    );

    // Calculate overall service status
    const overallStatus = this.calculateOverallStatus(evaluations);

    return {
      overallStatus,
      services: evaluations,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Calculate overall service status
   * 
   * SRE NOTE: Overall status is determined by:
   * - 🟢 GREEN: All SLOs met, Error Budget > 50%
   * - 🟡 YELLOW: SLOs met but Error Budget < 50%, or some SLOs not met
   * - 🔴 RED: Critical Error Budget (< 10%) or SLO violations
   */
  private calculateOverallStatus(evaluations: any[]): string {
    const hasErrors = evaluations.some(e => e.error);
    if (hasErrors) return '🔴';

    const allSloMet = evaluations.every(e => e.sloMet);
    const allHighBudget = evaluations.every(e => 
      e.errorBudgetRemainingPercentage > 50
    );
    const anyCritical = evaluations.some(e => 
      e.errorBudgetRemainingPercentage < 10 || !e.sloMet
    );

    if (anyCritical) return '🔴';
    if (allSloMet && allHighBudget) return '🟢';
    return '🟡';
  }
}
