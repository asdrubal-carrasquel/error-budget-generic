namespace EvaluationEngine.Domain.Entities;

/// <summary>
/// Service Level Indicator (SLI) Definition
/// 
/// SRE NOTE: SLI is a quantitative measure of service quality from the user's perspective.
/// It answers "How good is the service?" with a number between 0 and 1 (or 0-100%).
/// 
/// Common SLI types:
/// - Availability: Fraction of requests that succeed
/// - Latency: Fraction of requests faster than a threshold
/// - Throughput: Fraction of requests processed successfully
/// - Quality: Fraction of requests that are error-free
/// </summary>
public class SliDefinition
{
    public string Name { get; set; } = string.Empty;
    
    /// <summary>
    /// Type of SLI calculation (e.g., "ratio", "availability", "latency")
    /// SRE NOTE: Ratio is most common - good events / total events
    /// </summary>
    public string Type { get; set; } = "ratio";
    
    /// <summary>
    /// PromQL query for "good" events (numerator)
    /// Example: sum(rate(http_requests_total{status=~"2.."}[5m]))
    /// </summary>
    public string GoodQuery { get; set; } = string.Empty;
    
    /// <summary>
    /// PromQL query for total events (denominator)
    /// Example: sum(rate(http_requests_total[5m]))
    /// </summary>
    public string TotalQuery { get; set; } = string.Empty;
    
    /// <summary>
    /// Time window for evaluation (e.g., "30d", "7d", "24h")
    /// SRE NOTE: Window selection impacts sensitivity to recent changes vs historical trends
    /// </summary>
    public string Window { get; set; } = "30d";
}
