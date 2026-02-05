using EvaluationEngine.Domain.Entities;
using EvaluationEngine.Domain.ValueObjects;

namespace EvaluationEngine.Domain.Interfaces;

/// <summary>
/// SLO Evaluator Interface
/// 
/// SRE NOTE: SLO evaluation determines if current SLI meets the SLO target.
/// This is the core decision point for operational policies.
/// </summary>
public interface ISloEvaluator
{
    /// <summary>
    /// Evaluate if SLI meets SLO target
    /// </summary>
    bool Evaluate(SliValue sliValue, SloDefinition sloDefinition);
    
    /// <summary>
    /// Calculate error budget from SLO and SLI
    /// </summary>
    ErrorBudget CalculateErrorBudget(SliValue sliValue, SloDefinition sloDefinition);
    
    /// <summary>
    /// Calculate burn rate from error budget
    /// </summary>
    BurnRate CalculateBurnRate(ErrorBudget errorBudget);
}
