namespace EvaluationEngine.Api.DTOs;

/// <summary>
/// Request DTO for SLO evaluation
/// </summary>
public class EvaluateSloRequest
{
    public EvaluateSliRequest Sli { get; set; } = new();
    public double SloTarget { get; set; }
    public string SloWindow { get; set; } = "30d";
    public EvaluateSlaRequest? Sla { get; set; }
}

/// <summary>
/// Request DTO for SLA evaluation (optional)
/// </summary>
public class EvaluateSlaRequest
{
    public double SlaTarget { get; set; }
    public List<SlaPenaltyRequest> Penalties { get; set; } = new();
}

/// <summary>
/// SLA Penalty Request DTO
/// </summary>
public class SlaPenaltyRequest
{
    public double Threshold { get; set; }
    public string Impact { get; set; } = string.Empty;
}
