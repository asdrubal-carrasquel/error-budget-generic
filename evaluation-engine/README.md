# Evaluation Engine

.NET 8 Web API service responsible for executing Prometheus queries, calculating SLIs, evaluating SLOs/SLAs, and computing Error Budget and Burn Rate.

## 🏗️ Architecture

The Evaluation Engine follows Clean Architecture principles:

```
Api/                    # REST API layer (controllers, DTOs)
  ↓
Application/            # Use cases and application services
  ↓
Domain/                 # Domain entities, value objects, interfaces
  ↓
Infrastructure/         # External integrations (Prometheus client)
```

## 🧠 Key Concepts

### SLI Calculation

**Ratio SLI** (most common):
```
SLI = good_events / total_events
```

**Example**:
- Good Query: `sum(rate(http_requests_total{status=~"2.."}[5m]))`
- Total Query: `sum(rate(http_requests_total[5m]))`
- SLI = successful_requests / total_requests

### Error Budget Calculation

```csharp
error_budget_total = 1 - SLO_target
error_consumed = 1 - SLI_current
remaining = error_budget_total - error_consumed
```

**SRE NOTE**: Error Budget acts as a buffer between reliability and velocity. It quantifies how much unreliability we can "spend" while still meeting SLO.

### Burn Rate Calculation

```csharp
burn_rate = error_consumed / error_budget_total
```

**Interpretation**:
- `burn_rate > 1.0`: Consuming budget faster than allocated (danger zone)
- `burn_rate = 1.0`: Consuming at exactly the allocated rate
- `burn_rate < 1.0`: Consuming slower than allocated (safe zone)

## 🔌 API Endpoints

### Evaluate SLI

```http
POST /api/evaluation/sli
Content-Type: application/json

{
  "name": "availability",
  "type": "ratio",
  "goodQuery": "sum(rate(http_requests_total{status=~\"2..\"}[5m]))",
  "totalQuery": "sum(rate(http_requests_total[5m]))",
  "window": "30d"
}
```

**Response**:
```json
{
  "sliValue": 0.999,
  "sliPercentage": 99.9,
  "evaluatedAt": "2024-01-01T00:00:00Z",
  "window": "30d"
}
```

### Evaluate SLO

```http
POST /api/evaluation/slo
Content-Type: application/json

{
  "sli": {
    "name": "availability",
    "type": "ratio",
    "goodQuery": "sum(rate(http_requests_total{status=~\"2..\"}[5m]))",
    "totalQuery": "sum(rate(http_requests_total[5m]))",
    "window": "30d"
  },
  "sloTarget": 99.9,
  "sloWindow": "30d",
  "sla": {
    "slaTarget": 99.5,
    "penalties": [
      {
        "threshold": 99.0,
        "impact": "CREDIT_10"
      }
    ]
  }
}
```

**Response**:
```json
{
  "sliValue": 0.999,
  "sliPercentage": 99.9,
  "sloTarget": 99.9,
  "sloMet": true,
  "errorBudgetTotal": 0.001,
  "errorBudgetConsumed": 0.001,
  "errorBudgetRemaining": 0.0,
  "errorBudgetRemainingPercentage": 0.0,
  "burnRate": 1.0,
  "slaTarget": 99.5,
  "slaMet": true,
  "evaluatedAt": "2024-01-01T00:00:00Z",
  "window": "30d"
}
```

### Health Check

```http
GET /api/evaluation/health
```

## 🔧 Configuration

### appsettings.json

```json
{
  "Prometheus": {
    "BaseUrl": "http://localhost:9090",
    "TimeoutSeconds": 30
  }
}
```

### Environment Variables

- `Prometheus__BaseUrl`: Prometheus base URL
- `Prometheus__TimeoutSeconds`: Query timeout in seconds

## 🧪 Testing

### Local Development

1. Ensure Prometheus is running on port 9090
2. Run the service:
```bash
dotnet run --project evaluation-engine.csproj
```

3. Test the health endpoint:
```bash
curl http://localhost:8080/api/evaluation/health
```

## 📝 Prometheus Integration

The Evaluation Engine uses Prometheus HTTP API v1:

- **Query Range**: `/api/v1/query_range` for time series queries
- **Instant Query**: `/api/v1/query` for point-in-time queries

### Supported Time Windows

- `1h`: 1 hour
- `6h`: 6 hours
- `24h`: 24 hours
- `7d`: 7 days
- `30d`: 30 days

### Query Validation

PromQL queries are validated before execution. Invalid queries will return an error.

## 🎓 SRE Learning Points

### Why Separate Evaluation Engine?

1. **Separation of Concerns**: Evaluation logic is isolated from configuration management
2. **Language Flexibility**: Can be rewritten in any language without affecting Control Plane
3. **Scalability**: Can be scaled independently based on evaluation load
4. **Testing**: Easier to test evaluation logic in isolation

### Why .NET 8?

- High performance for query execution
- Strong typing for domain models
- Excellent async/await support for concurrent queries
- Cross-platform support

## 🚀 Deployment

### Docker

```bash
docker build -t evaluation-engine ./evaluation-engine
docker run -p 8080:8080 \
  -e Prometheus__BaseUrl=http://prometheus:9090 \
  evaluation-engine
```

### Kubernetes

See `evaluation-engine/k8s/` for Kubernetes manifests (if provided).

## 📚 Further Reading

- [Prometheus Querying](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [PromQL](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Error Budgets](https://sre.google/workbook/error-budget-policy/)
