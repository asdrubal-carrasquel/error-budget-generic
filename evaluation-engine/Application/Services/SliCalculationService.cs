using EvaluationEngine.Domain.Entities;
using EvaluationEngine.Domain.Interfaces;
using EvaluationEngine.Domain.ValueObjects;

namespace EvaluationEngine.Application.Services;

/// <summary>
/// SLI Calculation Service
/// 
/// SRE NOTE: This service implements SLI calculation logic.
/// Currently supports "ratio" type SLIs (most common).
/// 
/// Ratio SLI = good_events / total_events
/// 
/// Why ratio is most common:
/// - Availability: successful_requests / total_requests
/// - Latency: fast_requests / total_requests
/// - Quality: error_free_requests / total_requests
/// </summary>
public class SliCalculationService : ISliCalculator
{
    public async Task<SliValue> CalculateAsync(
        SliDefinition sliDefinition,
        PrometheusQueryResult goodQueryResult,
        PrometheusQueryResult totalQueryResult,
        CancellationToken cancellationToken = default)
    {
        // SRE NOTE: For ratio-type SLIs, we sum all time series values
        // This handles cases where metrics are split by labels (e.g., by instance, by endpoint)
        var goodSum = SumTimeSeries(goodQueryResult);
        var totalSum = SumTimeSeries(totalQueryResult);

        if (totalSum <= 0)
        {
            // SRE NOTE: If no total events, we can't calculate SLI
            // This might indicate missing metrics or incorrect queries
            throw new InvalidOperationException(
                "Cannot calculate SLI: total query returned zero or negative value. " +
                "Check that metrics are being collected and queries are correct.");
        }

        return SliValue.FromRatio(goodSum, totalSum);
    }

    /// <summary>
    /// Sum all values across all time series in the result
    /// 
    /// SRE NOTE: We sum the latest value from each time series.
    /// For range queries, we could average over time, but using latest is simpler
    /// and more responsive to current state.
    /// </summary>
    private double SumTimeSeries(PrometheusQueryResult result)
    {
        double sum = 0.0;

        foreach (var timeSeries in result.Result)
        {
            if (timeSeries.Values.Count > 0)
            {
                // Use the most recent value
                var latestValue = timeSeries.Values.OrderByDescending(v => v.Timestamp).First().Value;
                sum += latestValue;
            }
        }

        return sum;
    }
}
