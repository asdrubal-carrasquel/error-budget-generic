using EvaluationEngine.Domain.Entities;
using EvaluationEngine.Domain.Interfaces;
using EvaluationEngine.Domain.ValueObjects;
using EvaluationEngine.Application.Services;

namespace EvaluationEngine.Application.UseCases;

/// <summary>
/// Evaluate SLO Use Case
/// 
/// SRE NOTE: This use case evaluates if current SLI meets SLO target.
/// It also calculates Error Budget and Burn Rate for operational decision-making.
/// </summary>
public class EvaluateSloUseCase
{
    private readonly ISloEvaluator _sloEvaluator;
    private readonly ErrorBudgetService _errorBudgetService;

    public EvaluateSloUseCase(
        ISloEvaluator sloEvaluator,
        ErrorBudgetService errorBudgetService)
    {
        _sloEvaluator = sloEvaluator;
        _errorBudgetService = errorBudgetService;
    }

    public EvaluationResult Execute(
        SliValue sliValue,
        SloDefinition sloDefinition,
        SlaDefinition? slaDefinition = null)
    {
        // Evaluate SLO
        var sloMet = _sloEvaluator.Evaluate(sliValue, sloDefinition);

        // Calculate Error Budget
        var errorBudget = _errorBudgetService.CalculateErrorBudget(sliValue, sloDefinition);

        // Calculate Burn Rate
        var burnRate = _errorBudgetService.CalculateBurnRate(errorBudget);

        // Evaluate SLA if provided
        bool? slaMet = null;
        if (slaDefinition != null)
        {
            // SRE NOTE: SLA evaluation is similar to SLO, but with different target
            slaMet = sliValue.Percentage >= slaDefinition.Target;
        }

        return new EvaluationResult
        {
            SliValue = sliValue.Value,
            SloTarget = sloDefinition.Target / 100.0,
            SloMet = sloMet,
            ErrorBudgetTotal = errorBudget.Total,
            ErrorBudgetConsumed = errorBudget.Consumed,
            ErrorBudgetRemaining = errorBudget.Remaining,
            BurnRate = burnRate.Value,
            SlaTarget = slaDefinition?.Target / 100.0,
            SlaMet = slaMet,
            Window = sloDefinition.Window
        };
    }
}
