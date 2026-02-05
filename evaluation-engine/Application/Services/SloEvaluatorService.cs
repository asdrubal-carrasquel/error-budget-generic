using EvaluationEngine.Domain.Entities;
using EvaluationEngine.Domain.Interfaces;
using EvaluationEngine.Domain.ValueObjects;

namespace EvaluationEngine.Application.Services;

/// <summary>
/// SLO Evaluator Service Implementation
/// 
/// SRE NOTE: This service implements SLO evaluation logic.
/// SLO is met when SLI >= SLO target.
/// </summary>
public class SloEvaluatorService : ISloEvaluator
{
    public bool Evaluate(SliValue sliValue, SloDefinition sloDefinition)
    {
        // SRE NOTE: SLO is met when SLI value (as percentage) >= SLO target
        return sliValue.Percentage >= sloDefinition.Target;
    }

    public ErrorBudget CalculateErrorBudget(SliValue sliValue, SloDefinition sloDefinition)
    {
        return ErrorBudget.Calculate(sloDefinition.Target, sliValue.Percentage);
    }

    public BurnRate CalculateBurnRate(ErrorBudget errorBudget)
    {
        return BurnRate.Calculate(errorBudget.Consumed, errorBudget.Total);
    }
}
