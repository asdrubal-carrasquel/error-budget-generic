namespace EvaluationEngine.Api.DTOs;

/// <summary>
/// Standardized evaluation response
/// </summary>
public class EvaluationResponse
{
    public double SliValue { get; set; }
    public double SliPercentage { get; set; }
    public double SloTarget { get; set; }
    public bool SloMet { get; set; }
    public double ErrorBudgetTotal { get; set; }
    public double ErrorBudgetConsumed { get; set; }
    public double ErrorBudgetRemaining { get; set; }
    public double ErrorBudgetRemainingPercentage { get; set; }
    public double BurnRate { get; set; }
    public double? SlaTarget { get; set; }
    public bool? SlaMet { get; set; }
    public DateTime EvaluatedAt { get; set; }
    public string Window { get; set; } = string.Empty;
}
