using EvaluationEngine.Domain.Entities;
using EvaluationEngine.Domain.Interfaces;
using EvaluationEngine.Domain.ValueObjects;

namespace EvaluationEngine.Application.Services;

/// <summary>
/// Error Budget Service
/// 
/// SRE NOTE: This service calculates Error Budget and Burn Rate.
/// These are the key metrics that drive operational decisions.
/// </summary>
public class ErrorBudgetService
{
    /// <summary>
    /// Calculate error budget from SLO and SLI
    /// </summary>
    public ErrorBudget CalculateErrorBudget(SliValue sliValue, SloDefinition sloDefinition)
    {
        return ErrorBudget.Calculate(sloDefinition.Target, sliValue.Percentage);
    }

    /// <summary>
    /// Calculate burn rate from error budget
    /// </summary>
    public BurnRate CalculateBurnRate(ErrorBudget errorBudget)
    {
        return BurnRate.Calculate(errorBudget.Consumed, errorBudget.Total);
    }
}
