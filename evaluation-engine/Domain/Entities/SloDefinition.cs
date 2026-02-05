namespace EvaluationEngine.Domain.Entities;

/// <summary>
/// Service Level Objective (SLO) Definition
/// 
/// SRE NOTE: SLO is a target value for an SLI over a time window.
/// It defines "How reliable should the service be?" 
/// 
/// Key principles:
/// - SLOs should be tighter than SLAs (internal target vs customer commitment)
/// - SLOs guide operational decisions, not SLAs
/// - Error Budget = 1 - SLO (the "budget" of unreliability we can consume)
/// </summary>
public class SloDefinition
{
    /// <summary>
    /// Target SLI value (as percentage, e.g., 99.9 means 99.9%)
    /// SRE NOTE: This is the internal target. Should be higher than SLA to create buffer.
    /// </summary>
    public double Target { get; set; }
    
    /// <summary>
    /// Time window for SLO evaluation (e.g., "30d", "7d")
    /// SRE NOTE: Must match or be compatible with SLI window
    /// </summary>
    public string Window { get; set; } = "30d";
}
