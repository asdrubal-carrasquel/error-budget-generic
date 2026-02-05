namespace EvaluationEngine.Infrastructure.Prometheus;

/// <summary>
/// Prometheus connection settings
/// </summary>
public class PrometheusSettings
{
    public string BaseUrl { get; set; } = "http://localhost:9090";
    public int TimeoutSeconds { get; set; } = 30;
}
