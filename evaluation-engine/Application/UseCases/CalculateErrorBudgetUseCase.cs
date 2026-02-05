using EvaluationEngine.Domain.Entities;
using EvaluationEngine.Domain.ValueObjects;
using EvaluationEngine.Application.Services;

namespace EvaluationEngine.Application.UseCases;

/// <summary>
/// Calculate Error Budget Use Case
/// 
/// SRE NOTE: This is a focused use case for error budget calculation.
/// Can be used independently or as part of full evaluation.
/// </summary>
public class CalculateErrorBudgetUseCase
{
    private readonly ErrorBudgetService _errorBudgetService;

    public CalculateErrorBudgetUseCase(ErrorBudgetService errorBudgetService)
    {
        _errorBudgetService = errorBudgetService;
    }

    public ErrorBudget Execute(SliValue sliValue, SloDefinition sloDefinition)
    {
        return _errorBudgetService.CalculateErrorBudget(sliValue, sloDefinition);
    }
}
