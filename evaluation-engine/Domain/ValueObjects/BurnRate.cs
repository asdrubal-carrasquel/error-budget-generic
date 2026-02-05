namespace EvaluationEngine.Domain.ValueObjects;

/// <summary>
/// Burn Rate Value Object
/// 
/// SRE NOTE: Burn Rate measures how fast we're consuming error budget.
/// 
/// Interpretation:
/// - Burn Rate = 1.0: Consuming budget at exactly the allocated rate
/// - Burn Rate > 1.0: Consuming budget faster than allocated (danger zone)
/// - Burn Rate < 1.0: Consuming budget slower than allocated (safe zone)
/// 
/// Operational implications:
/// - High burn rate (> 1.0) means we need to either:
///   1. Reduce error rate (fix reliability issues)
///   2. Slow feature velocity (stop deploying new features)
/// - Burn rate helps predict when error budget will be exhausted
/// </summary>
public class BurnRate
{
    public double Value { get; }
    
    private BurnRate(double value)
    {
        Value = value;
    }
    
    /// <summary>
    /// Calculate burn rate from error budget consumed and total
    /// </summary>
    public static BurnRate Calculate(double errorBudgetConsumed, double errorBudgetTotal)
    {
        if (errorBudgetTotal <= 0)
        {
            // SRE NOTE: If no error budget allocated (100% SLO), burn rate is infinite
            // This indicates a problem with SLO definition
            return new BurnRate(double.PositiveInfinity);
        }
        
        var burnRate = errorBudgetConsumed / errorBudgetTotal;
        return new BurnRate(burnRate);
    }
    
    /// <summary>
    /// Check if burn rate indicates critical consumption
    /// </summary>
    public bool IsCritical => Value > 1.0;
    
    /// <summary>
    /// Check if burn rate is safe
    /// </summary>
    public bool IsSafe => Value < 1.0;
}
