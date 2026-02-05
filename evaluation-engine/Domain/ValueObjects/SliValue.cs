namespace EvaluationEngine.Domain.ValueObjects;

/// <summary>
/// SLI Value Object
/// 
/// SRE NOTE: SLI values are always between 0.0 and 1.0 (or 0% and 100%).
/// This value object ensures type safety and validation.
/// </summary>
public class SliValue
{
    public double Value { get; }
    
    /// <summary>
    /// Value as percentage (0.0 to 100.0)
    /// </summary>
    public double Percentage => Value * 100.0;
    
    private SliValue(double value)
    {
        if (value < 0.0 || value > 1.0)
        {
            throw new ArgumentException("SLI value must be between 0.0 and 1.0", nameof(value));
        }
        
        Value = value;
    }
    
    /// <summary>
    /// Create SLI value from decimal (0.0 to 1.0)
    /// </summary>
    public static SliValue FromDecimal(double value) => new(value);
    
    /// <summary>
    /// Create SLI value from percentage (0.0 to 100.0)
    /// </summary>
    public static SliValue FromPercentage(double percentage) => new(percentage / 100.0);
    
    /// <summary>
    /// Calculate SLI from good and total counts
    /// </summary>
    public static SliValue FromRatio(double good, double total)
    {
        if (total <= 0)
        {
            throw new ArgumentException("Total count must be greater than 0", nameof(total));
        }
        
        var ratio = good / total;
        return new SliValue(Math.Max(0.0, Math.Min(1.0, ratio)));
    }
}
