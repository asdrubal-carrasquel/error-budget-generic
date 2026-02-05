namespace EvaluationEngine.Api.DTOs;

/// <summary>
/// Request DTO for SLI evaluation
/// </summary>
public class EvaluateSliRequest
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "ratio";
    public string GoodQuery { get; set; } = string.Empty;
    public string TotalQuery { get; set; } = string.Empty;
    public string Window { get; set; } = "30d";
}
