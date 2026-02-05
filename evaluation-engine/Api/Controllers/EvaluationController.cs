using Microsoft.AspNetCore.Mvc;
using EvaluationEngine.Api.DTOs;
using EvaluationEngine.Domain.Entities;
using EvaluationEngine.Domain.ValueObjects;
using EvaluationEngine.Application.UseCases;

namespace EvaluationEngine.Api.Controllers;

/// <summary>
/// Evaluation Controller
/// 
/// SRE NOTE: This controller exposes REST endpoints for SLI/SLO/SLA evaluation.
/// The Control Plane calls these endpoints to get evaluation results.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class EvaluationController : ControllerBase
{
    private readonly EvaluateSliUseCase _evaluateSliUseCase;
    private readonly EvaluateSloUseCase _evaluateSloUseCase;
    private readonly ILogger<EvaluationController> _logger;

    public EvaluationController(
        EvaluateSliUseCase evaluateSliUseCase,
        EvaluateSloUseCase evaluateSloUseCase,
        ILogger<EvaluationController> logger)
    {
        _evaluateSliUseCase = evaluateSliUseCase;
        _evaluateSloUseCase = evaluateSloUseCase;
        _logger = logger;
    }

    /// <summary>
    /// Evaluate SLI only
    /// </summary>
    [HttpPost("sli")]
    public async Task<ActionResult<EvaluationResponse>> EvaluateSli([FromBody] EvaluateSliRequest request)
    {
        try
        {
            var sliDefinition = new SliDefinition
            {
                Name = request.Name,
                Type = request.Type,
                GoodQuery = request.GoodQuery,
                TotalQuery = request.TotalQuery,
                Window = request.Window
            };

            var sliValue = await _evaluateSliUseCase.ExecuteAsync(sliDefinition);

            return Ok(new EvaluationResponse
            {
                SliValue = sliValue.Value,
                SliPercentage = sliValue.Percentage,
                EvaluatedAt = DateTime.UtcNow,
                Window = request.Window
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error evaluating SLI");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    /// <summary>
    /// Evaluate SLO (includes SLI calculation)
    /// </summary>
    [HttpPost("slo")]
    public async Task<ActionResult<EvaluationResponse>> EvaluateSlo([FromBody] EvaluateSloRequest request)
    {
        try
        {
            // Calculate SLI first
            var sliDefinition = new SliDefinition
            {
                Name = request.Sli.Name,
                Type = request.Sli.Type,
                GoodQuery = request.Sli.GoodQuery,
                TotalQuery = request.Sli.TotalQuery,
                Window = request.Sli.Window
            };

            var sliValue = await _evaluateSliUseCase.ExecuteAsync(sliDefinition);

            // Evaluate SLO
            var sloDefinition = new SloDefinition
            {
                Target = request.SloTarget,
                Window = request.SloWindow
            };

            SlaDefinition? slaDefinition = null;
            if (request.Sla != null)
            {
                slaDefinition = new SlaDefinition
                {
                    Target = request.Sla.SlaTarget,
                    Penalties = request.Sla.Penalties.Select(p => new SlaPenalty
                    {
                        Threshold = p.Threshold,
                        Impact = p.Impact
                    }).ToList()
                };
            }

            var result = _evaluateSloUseCase.Execute(sliValue, sloDefinition, slaDefinition);

            return Ok(new EvaluationResponse
            {
                SliValue = result.SliValue,
                SliPercentage = result.SliValue * 100.0,
                SloTarget = result.SloTarget * 100.0,
                SloMet = result.SloMet,
                ErrorBudgetTotal = result.ErrorBudgetTotal,
                ErrorBudgetConsumed = result.ErrorBudgetConsumed,
                ErrorBudgetRemaining = result.ErrorBudgetRemaining,
                ErrorBudgetRemainingPercentage = result.ErrorBudgetTotal > 0 
                    ? result.ErrorBudgetRemaining / result.ErrorBudgetTotal 
                    : 0,
                BurnRate = result.BurnRate,
                SlaTarget = result.SlaTarget.HasValue ? result.SlaTarget.Value * 100.0 : null,
                SlaMet = result.SlaMet,
                EvaluatedAt = result.EvaluatedAt,
                Window = result.Window
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error evaluating SLO");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    /// <summary>
    /// Health check endpoint
    /// </summary>
    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }
}
