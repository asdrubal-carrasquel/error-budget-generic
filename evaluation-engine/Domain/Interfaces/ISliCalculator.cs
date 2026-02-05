using EvaluationEngine.Domain.Entities;
using EvaluationEngine.Domain.ValueObjects;

namespace EvaluationEngine.Domain.Interfaces;

/// <summary>
/// SLI Calculator Interface
/// 
/// SRE NOTE: Different SLI types require different calculation methods:
/// - Ratio: good_events / total_events
/// - Availability: uptime / (uptime + downtime)
/// - Latency: requests_below_threshold / total_requests
/// 
/// This interface allows for extensibility to support multiple SLI types.
/// </summary>
public interface ISliCalculator
{
    /// <summary>
    /// Calculate SLI value from Prometheus query results
    /// </summary>
    Task<SliValue> CalculateAsync(
        SliDefinition sliDefinition,
        PrometheusQueryResult goodQueryResult,
        PrometheusQueryResult totalQueryResult,
        CancellationToken cancellationToken = default);
}
