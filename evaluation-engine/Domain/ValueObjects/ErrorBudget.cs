namespace EvaluationEngine.Domain.ValueObjects;

/// <summary>
/// Error Budget Value Object
/// 
/// SRE NOTE: Error Budget is the key concept that balances reliability and feature velocity.
/// 
/// How it works:
/// - Error Budget = 1 - SLO (e.g., 99.9% SLO = 0.1% error budget)
/// - When error budget is consumed, we must slow down or stop feature work
/// - This creates a natural feedback loop: unreliable services get less new features
/// 
/// Why this matters:
/// Without Error Budget, teams optimize for either reliability (too slow) or velocity (too unreliable).
/// Error Budget forces teams to balance both, making reliability a feature velocity constraint.
/// </summary>
public class ErrorBudget
{
    public double Total { get; }
    public double Consumed { get; }
    public double Remaining { get; }
    
    /// <summary>
    /// Percentage of error budget remaining (0.0 to 1.0)
    /// </summary>
    public double RemainingPercentage { get; }
    
    private ErrorBudget(double total, double consumed)
    {
        Total = total;
        Consumed = consumed;
        Remaining = Math.Max(0, total - consumed);
        RemainingPercentage = total > 0 ? Remaining / total : 0;
    }
    
    /// <summary>
    /// Calculate error budget from SLO target and current SLI value
    /// </summary>
    public static ErrorBudget Calculate(double sloTarget, double sliValue)
    {
        // SRE NOTE: SLO target is typically in percentage (99.9), convert to decimal (0.999)
        var sloTargetDecimal = sloTarget / 100.0;
        var sliValueDecimal = sliValue / 100.0;
        
        // Error budget total = 1 - SLO target
        var total = 1.0 - sloTargetDecimal;
        
        // Error consumed = 1 - SLI value
        var consumed = 1.0 - sliValueDecimal;
        
        return new ErrorBudget(total, consumed);
    }
    
    /// <summary>
    /// Check if error budget is exhausted
    /// </summary>
    public bool IsExhausted => Remaining <= 0;
    
    /// <summary>
    /// Check if error budget is below threshold (for policy application)
    /// </summary>
    public bool IsBelowThreshold(double thresholdPercentage) => RemainingPercentage < thresholdPercentage;
}
