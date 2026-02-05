using EvaluationEngine.Domain.Entities;

namespace EvaluationEngine.Domain.Interfaces;

/// <summary>
/// Prometheus Client Interface
/// 
/// SRE NOTE: This abstraction allows for:
/// 1. Testing without real Prometheus
/// 2. Future support for other metric backends (e.g., CloudWatch, Datadog)
/// 3. Mock implementations for development
/// </summary>
public interface IPrometheusClient
{
    /// <summary>
    /// Execute a PromQL query and return the result
    /// </summary>
    /// <param name="query">PromQL query string</param>
    /// <param name="startTime">Query start time</param>
    /// <param name="endTime">Query end time</param>
    /// <param name="step">Query resolution step (e.g., "15s")</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Query result as time series data</returns>
    Task<PrometheusQueryResult> QueryRangeAsync(
        string query,
        DateTime startTime,
        DateTime endTime,
        string step,
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Execute an instant PromQL query (single point in time)
    /// </summary>
    Task<PrometheusQueryResult> QueryAsync(
        string query,
        DateTime? time = null,
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Validate PromQL query syntax
    /// </summary>
    Task<bool> ValidateQueryAsync(string query, CancellationToken cancellationToken = default);
}

/// <summary>
/// Prometheus Query Result
/// </summary>
public class PrometheusQueryResult
{
    public string ResultType { get; set; } = string.Empty;
    public List<PrometheusTimeSeries> Result { get; set; } = new();
}

/// <summary>
/// Prometheus Time Series
/// </summary>
public class PrometheusTimeSeries
{
    public Dictionary<string, string> Metric { get; set; } = new();
    public List<PrometheusDataPoint> Values { get; set; } = new();
}

/// <summary>
/// Prometheus Data Point (timestamp, value)
/// </summary>
public class PrometheusDataPoint
{
    public DateTime Timestamp { get; set; }
    public double Value { get; set; }
}
