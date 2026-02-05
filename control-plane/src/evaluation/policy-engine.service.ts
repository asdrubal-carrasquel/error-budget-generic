import { Injectable } from '@nestjs/common';
import { PolicyService } from '../policy/policy.service';

/**
 * Policy Engine Service
 * 
 * SRE NOTE: This service applies operational policies based on Error Budget remaining percentage.
 * 
 * Policy actions:
 * - FULL_SPEED: Error budget > 50% - normal operations, full feature velocity
 * - LIMITED: Error budget 10-50% - reduce feature velocity, focus on reliability
 * - FREEZE: Error budget < 10% - stop all non-critical deployments
 * 
 * Why policies matter:
 * - They enforce Error Budget discipline: unreliable services get less new features
 * - They create a natural feedback loop between reliability and velocity
 * - They prevent teams from ignoring reliability issues
 * 
 * What happens if we don't use policies:
 * - Teams might continue deploying features even when reliability is poor
 * - Error Budget gets exhausted without consequences
 * - SLO violations become common
 * - No incentive to improve reliability
 */
@Injectable()
export class PolicyEngineService {
  constructor(private policyService: PolicyService) {}

  /**
   * Apply the appropriate policy based on Error Budget remaining percentage
   */
  async applyPolicy(errorBudgetRemainingPercentage: number): Promise<any> {
    const policy = await this.policyService.getApplicablePolicy(errorBudgetRemainingPercentage);

    if (!policy) {
      // SRE NOTE: If no policy matches, we're in a critical state
      // Default to FREEZE to prevent further degradation
      return {
        action: 'FREEZE',
        description: 'No policy configured - defaulting to FREEZE for safety',
        threshold: 0,
      };
    }

    return {
      action: policy.action,
      description: policy.description,
      threshold: policy.threshold,
    };
  }

  /**
   * Get all policies (for display purposes)
   */
  async getAllPolicies() {
    return this.policyService.findAll();
  }
}
