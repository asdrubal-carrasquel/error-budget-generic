using System.Text.Json.Serialization;

namespace EvaluationEngine.Infrastructure.Prometheus;

/// <summary>
/// Prometheus API Response Models
/// These match the Prometheus HTTP API v1 format
/// </summary>
public class PrometheusApiResponse
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;
    
    [JsonPropertyName("data")]
    public PrometheusData? Data { get; set; }
    
    [JsonPropertyName("errorType")]
    public string? ErrorType { get; set; }
    
    [JsonPropertyName("error")]
    public string? Error { get; set; }
}

public class PrometheusData
{
    [JsonPropertyName("resultType")]
    public string ResultType { get; set; } = string.Empty;
    
    [JsonPropertyName("result")]
    public List<PrometheusResultItem> Result { get; set; } = new();
}

public class PrometheusResultItem
{
    [JsonPropertyName("metric")]
    public Dictionary<string, string> Metric { get; set; } = new();
    
    [JsonPropertyName("values")]
    public List<List<object>>? Values { get; set; }
    
    [JsonPropertyName("value")]
    public List<object>? Value { get; set; }
}
