namespace EvaluationEngine.Domain.Entities;

/// <summary>
/// Service Level Agreement (SLA) Definition
/// 
/// SRE NOTE: SLA is a business contract with customers, not an operational target.
/// 
/// Critical distinction:
/// - SLA: Customer-facing commitment with financial penalties
/// - SLO: Internal reliability target that drives operations
/// - SLI: Measured service quality
/// 
/// IMPORTANT: Never use SLA to make operational decisions. Use SLO and Error Budget instead.
/// SLA violations are business problems, not engineering problems.
/// </summary>
public class SlaDefinition
{
    /// <summary>
    /// Target SLI value for SLA (as percentage, e.g., 99.5 means 99.5%)
    /// SRE NOTE: Typically lower than SLO to provide business buffer
    /// </summary>
    public double Target { get; set; }
    
    /// <summary>
    /// Financial penalties for SLA violations
    /// SRE NOTE: These are business consequences, not operational triggers
    /// </summary>
    public List<SlaPenalty> Penalties { get; set; } = new();
}

/// <summary>
/// SLA Penalty Definition
/// </summary>
public class SlaPenalty
{
    /// <summary>
    /// Threshold SLI value (as percentage) below which penalty applies
    /// </summary>
    public double Threshold { get; set; }
    
    /// <summary>
    /// Impact description (e.g., "CREDIT_10", "NONE", "TERMINATION")
    /// </summary>
    public string Impact { get; set; } = string.Empty;
}
