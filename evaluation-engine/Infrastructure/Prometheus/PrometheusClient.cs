using System.Text.Json;
using EvaluationEngine.Domain.Interfaces;
using Microsoft.Extensions.Options;
using PrometheusQueryResult = EvaluationEngine.Domain.Interfaces.PrometheusQueryResult;
using PrometheusTimeSeries = EvaluationEngine.Domain.Interfaces.PrometheusTimeSeries;
using PrometheusDataPoint = EvaluationEngine.Domain.Interfaces.PrometheusDataPoint;

namespace EvaluationEngine.Infrastructure.Prometheus;

/// <summary>
/// Prometheus HTTP Client Implementation
/// 
/// SRE NOTE: This client communicates with Prometheus using the HTTP API v1.
/// We use /api/v1/query_range for time series queries (required for SLI calculation).
/// 
/// Why query_range vs query:
/// - query_range: Returns time series data over a time window (needed for SLI)
/// - query: Returns instant value at a point in time (not sufficient for SLI)
/// </summary>
public class PrometheusClient : IPrometheusClient
{
    private readonly HttpClient _httpClient;
    private readonly PrometheusSettings _settings;
    private readonly JsonSerializerOptions _jsonOptions;

    public PrometheusClient(HttpClient httpClient, IOptions<PrometheusSettings> settings)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        _httpClient.BaseAddress = new Uri(_settings.BaseUrl);
        _httpClient.Timeout = TimeSpan.FromSeconds(_settings.TimeoutSeconds);
        
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
    }

    public async Task<PrometheusQueryResult> QueryRangeAsync(
        string query,
        DateTime startTime,
        DateTime endTime,
        string step,
        CancellationToken cancellationToken = default)
    {
        // SRE NOTE: Prometheus expects Unix timestamps
        var startTimestamp = ((DateTimeOffset)startTime).ToUnixTimeSeconds();
        var endTimestamp = ((DateTimeOffset)endTime).ToUnixTimeSeconds();
        
        var url = $"/api/v1/query_range?query={Uri.EscapeDataString(query)}" +
                  $"&start={startTimestamp}" +
                  $"&end={endTimestamp}" +
                  $"&step={step}";

        var response = await _httpClient.GetAsync(url, cancellationToken);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        var apiResponse = JsonSerializer.Deserialize<PrometheusApiResponse>(content, _jsonOptions);

        if (apiResponse?.Status != "success" || apiResponse.Data == null)
        {
            throw new InvalidOperationException(
                $"Prometheus query failed: {apiResponse?.Error ?? "Unknown error"}");
        }

        return ConvertToQueryResult(apiResponse.Data);
    }

    public async Task<PrometheusQueryResult> QueryAsync(
        string query,
        DateTime? time = null,
        CancellationToken cancellationToken = default)
    {
        var timestamp = time != null 
            ? ((DateTimeOffset)time.Value).ToUnixTimeSeconds() 
            : ((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds();
        
        var url = $"/api/v1/query?query={Uri.EscapeDataString(query)}&time={timestamp}";

        var response = await _httpClient.GetAsync(url, cancellationToken);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync(cancellationToken);
        var apiResponse = JsonSerializer.Deserialize<PrometheusApiResponse>(content, _jsonOptions);

        if (apiResponse?.Status != "success" || apiResponse.Data == null)
        {
            throw new InvalidOperationException(
                $"Prometheus query failed: {apiResponse?.Error ?? "Unknown error"}");
        }

        return ConvertToQueryResult(apiResponse.Data);
    }

    public async Task<bool> ValidateQueryAsync(string query, CancellationToken cancellationToken = default)
    {
        try
        {
            // SRE NOTE: We validate by attempting a query with a small time range
            // Prometheus will return an error if the query is invalid
            var now = DateTime.UtcNow;
            var past = now.AddMinutes(-5);
            
            await QueryRangeAsync(query, past, now, "15s", cancellationToken);
            return true;
        }
        catch
        {
            return false;
        }
    }

    private PrometheusQueryResult ConvertToQueryResult(PrometheusData data)
    {
        var result = new PrometheusQueryResult
        {
            ResultType = data.ResultType
        };

        foreach (var item in data.Result)
        {
            var timeSeries = new PrometheusTimeSeries
            {
                Metric = item.Metric
            };

            // Handle range query results (values array)
            if (item.Values != null)
            {
                foreach (var valuePair in item.Values)
                {
                    if (valuePair.Count >= 2 &&
                        double.TryParse(valuePair[0].ToString(), out var timestamp) &&
                        double.TryParse(valuePair[1].ToString(), out var value))
                    {
                        timeSeries.Values.Add(new PrometheusDataPoint
                        {
                            Timestamp = DateTimeOffset.FromUnixTimeSeconds((long)timestamp).DateTime,
                            Value = value
                        });
                    }
                }
            }
            // Handle instant query results (value array)
            else if (item.Value != null && item.Value.Count >= 2)
            {
                if (double.TryParse(item.Value[0].ToString(), out var timestamp) &&
                    double.TryParse(item.Value[1].ToString(), out var value))
                {
                    timeSeries.Values.Add(new PrometheusDataPoint
                    {
                        Timestamp = DateTimeOffset.FromUnixTimeSeconds((long)timestamp).DateTime,
                        Value = value
                    });
                }
            }

            result.Result.Add(timeSeries);
        }

        return result;
    }
}
