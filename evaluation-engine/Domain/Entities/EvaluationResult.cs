namespace EvaluationEngine.Domain.Entities;

/// <summary>
/// Normalized evaluation result structure
/// 
/// SRE NOTE: This structure provides a consistent interface for all evaluation results,
/// regardless of the underlying SLI type or calculation method.
/// </summary>
public class EvaluationResult
{
    /// <summary>
    /// Current SLI value (0.0 to 1.0, where 1.0 = 100%)
    /// </summary>
    public double SliValue { get; set; }
    
    /// <summary>
    /// SLO target value (0.0 to 1.0)
    /// </summary>
    public double SloTarget { get; set; }
    
    /// <summary>
    /// Whether SLO is currently met
    /// </summary>
    public bool SloMet { get; set; }
    
    /// <summary>
    /// Total error budget (1.0 - SLO target)
    /// SRE NOTE: Error Budget acts as a buffer between reliability and velocity.
    /// It quantifies how much unreliability we can "spend" while still meeting SLO.
    /// </summary>
    public double ErrorBudgetTotal { get; set; }
    
    /// <summary>
    /// Error budget consumed (1.0 - SLI value)
    /// </summary>
    public double ErrorBudgetConsumed { get; set; }
    
    /// <summary>
    /// Remaining error budget
    /// </summary>
    public double ErrorBudgetRemaining { get; set; }
    
    /// <summary>
    /// Burn rate (error consumed / error budget total)
    /// SRE NOTE: Burn rate > 1.0 means we're consuming budget faster than allocated.
    /// High burn rate indicates urgent need to reduce error rate or slow feature velocity.
    /// </summary>
    public double BurnRate { get; set; }
    
    /// <summary>
    /// SLA target value (0.0 to 1.0)
    /// </summary>
    public double? SlaTarget { get; set; }
    
    /// <summary>
    /// Whether SLA is currently met
    /// </summary>
    public bool? SlaMet { get; set; }
    
    /// <summary>
    /// Evaluation timestamp
    /// </summary>
    public DateTime EvaluatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Time window used for evaluation
    /// </summary>
    public string Window { get; set; } = string.Empty;
}
