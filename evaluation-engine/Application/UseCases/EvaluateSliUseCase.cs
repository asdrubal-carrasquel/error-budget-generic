using EvaluationEngine.Domain.Entities;
using EvaluationEngine.Domain.Interfaces;
using EvaluationEngine.Domain.ValueObjects;
using EvaluationEngine.Application.Services;

namespace EvaluationEngine.Application.UseCases;

/// <summary>
/// Evaluate SLI Use Case
/// 
/// SRE NOTE: This use case orchestrates SLI calculation:
/// 1. Execute Prometheus queries (good and total)
/// 2. Calculate SLI value from query results
/// 3. Return normalized SLI value
/// </summary>
public class EvaluateSliUseCase
{
    private readonly PrometheusQueryService _queryService;
    private readonly ISliCalculator _sliCalculator;

    public EvaluateSliUseCase(
        PrometheusQueryService queryService,
        ISliCalculator sliCalculator)
    {
        _queryService = queryService;
        _sliCalculator = sliCalculator;
    }

    public async Task<SliValue> ExecuteAsync(
        SliDefinition sliDefinition,
        CancellationToken cancellationToken = default)
    {
        // Execute both queries in parallel
        var (goodResult, totalResult) = await _queryService.ExecuteSliQueriesAsync(
            sliDefinition,
            cancellationToken);

        // Calculate SLI value
        var sliValue = await _sliCalculator.CalculateAsync(
            sliDefinition,
            goodResult,
            totalResult,
            cancellationToken);

        return sliValue;
    }
}
