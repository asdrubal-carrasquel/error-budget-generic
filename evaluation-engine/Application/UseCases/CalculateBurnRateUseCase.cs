using EvaluationEngine.Domain.ValueObjects;
using EvaluationEngine.Application.Services;

namespace EvaluationEngine.Application.UseCases;

/// <summary>
/// Calculate Burn Rate Use Case
/// 
/// SRE NOTE: Burn rate calculation is typically done as part of full evaluation,
/// but this use case allows independent calculation when needed.
/// </summary>
public class CalculateBurnRateUseCase
{
    private readonly ErrorBudgetService _errorBudgetService;

    public CalculateBurnRateUseCase(ErrorBudgetService errorBudgetService)
    {
        _errorBudgetService = errorBudgetService;
    }

    public BurnRate Execute(ErrorBudget errorBudget)
    {
        return _errorBudgetService.CalculateBurnRate(errorBudget);
    }
}
