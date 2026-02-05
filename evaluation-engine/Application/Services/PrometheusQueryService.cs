using EvaluationEngine.Domain.Entities;
using EvaluationEngine.Domain.Interfaces;

namespace EvaluationEngine.Application.Services;

/// <summary>
/// Prometheus Query Service
/// 
/// SRE NOTE: This service orchestrates Prometheus queries for SLI calculation.
/// It handles time window parsing and query execution.
/// </summary>
public class PrometheusQueryService
{
    private readonly IPrometheusClient _prometheusClient;

    public PrometheusQueryService(IPrometheusClient prometheusClient)
    {
        _prometheusClient = prometheusClient;
    }

    /// <summary>
    /// Execute queries for SLI calculation
    /// </summary>
    public async Task<(PrometheusQueryResult GoodResult, PrometheusQueryResult TotalResult)> ExecuteSliQueriesAsync(
        SliDefinition sliDefinition,
        CancellationToken cancellationToken = default)
    {
        var (startTime, endTime, step) = ParseWindow(sliDefinition.Window);
        
        var goodTask = _prometheusClient.QueryRangeAsync(
            sliDefinition.GoodQuery,
            startTime,
            endTime,
            step,
            cancellationToken);
        
        var totalTask = _prometheusClient.QueryRangeAsync(
            sliDefinition.TotalQuery,
            startTime,
            endTime,
            step,
            cancellationToken);

        await Task.WhenAll(goodTask, totalTask);

        return (await goodTask, await totalTask);
    }

    /// <summary>
    /// Parse time window string to start/end times and step
    /// 
    /// SRE NOTE: Window selection impacts SLI calculation:
    /// - Short windows (1h, 6h): More sensitive to recent changes, good for alerting
    /// - Long windows (30d): More stable, good for SLO evaluation
    /// </summary>
    private (DateTime StartTime, DateTime EndTime, string Step) ParseWindow(string window)
    {
        var endTime = DateTime.UtcNow;
        var startTime = window switch
        {
            "1h" => endTime.AddHours(-1),
            "6h" => endTime.AddHours(-6),
            "24h" => endTime.AddHours(-24),
            "7d" => endTime.AddDays(-7),
            "30d" => endTime.AddDays(-30),
            _ => throw new ArgumentException($"Unsupported window: {window}", nameof(window))
        };

        // SRE NOTE: Step size should be appropriate for the window
        // Rule of thumb: ~240 data points per window
        var step = window switch
        {
            "1h" => "15s",
            "6h" => "1m",
            "24h" => "5m",
            "7d" => "30m",
            "30d" => "3h",
            _ => "15s"
        };

        return (startTime, endTime, step);
    }
}
