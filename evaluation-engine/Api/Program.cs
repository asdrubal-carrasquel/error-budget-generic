using EvaluationEngine.Domain.Interfaces;
using EvaluationEngine.Infrastructure.Prometheus;
using EvaluationEngine.Application.Services;
using EvaluationEngine.Application.UseCases;
using EvaluationEngine.Api.Controllers;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Prometheus settings
builder.Services.Configure<PrometheusSettings>(options =>
{
    options.BaseUrl = builder.Configuration["Prometheus:BaseUrl"] ?? "http://localhost:9090";
    options.TimeoutSeconds = int.Parse(builder.Configuration["Prometheus:TimeoutSeconds"] ?? "30");
});

// Register HTTP client for Prometheus
builder.Services.AddHttpClient<IPrometheusClient, PrometheusClient>();

// Register application services
builder.Services.AddScoped<PrometheusQueryService>();
builder.Services.AddScoped<ISliCalculator, SliCalculationService>();
builder.Services.AddScoped<ISloEvaluator, SloEvaluatorService>();
builder.Services.AddScoped<ErrorBudgetService>();

// Register use cases
builder.Services.AddScoped<EvaluateSliUseCase>();
builder.Services.AddScoped<EvaluateSloUseCase>();
builder.Services.AddScoped<CalculateErrorBudgetUseCase>();
builder.Services.AddScoped<CalculateBurnRateUseCase>();

// CORS configuration (for Control Plane to call this service)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure HTTP pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();
