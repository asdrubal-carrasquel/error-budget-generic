# Error Budget Controller

A config-driven, generic Error Budget Controller system for managing SLIs, SLOs, and SLAs with automatic Error Budget calculation and operational policy enforcement.

## 🏗️ Architecture

The system is divided into two main components:

1. **Evaluation Engine (.NET 8)**: Executes Prometheus queries, calculates SLIs, evaluates SLOs/SLAs, and computes Error Budget and Burn Rate
2. **Control Plane (NestJS)**: Manages configuration, orchestrates evaluations, and serves the React dashboard

### System Flow

```
User → Control Plane (NestJS) → Evaluation Engine (.NET) → Prometheus → Metrics
                ↓
         PostgreSQL (Config)
                ↓
         React Dashboard
```

## 🧠 SRE Concepts Explained

### SLI (Service Level Indicator)
**What it is**: A quantitative measure of service quality from the user's perspective.

**Example**: Availability = successful_requests / total_requests

**Why it matters**: SLI answers "How good is the service?" with a number between 0 and 1 (or 0-100%).

### SLO (Service Level Objective)
**What it is**: A target value for an SLI over a time window.

**Example**: 99.9% availability over 30 days

**Why it matters**: SLO defines "How reliable should the service be?" and guides operational decisions.

### SLA (Service Level Agreement)
**What it is**: A business contract with customers, including financial penalties.

**Example**: 99.5% availability with 10% credit if violated

**Why it matters**: SLA is for business reporting, NOT operational decisions. Use SLO and Error Budget for operations.

### Error Budget
**What it is**: The "budget" of unreliability we can consume while still meeting SLO.

**Calculation**: Error Budget = 1 - SLO target

**Example**: If SLO = 99.9%, Error Budget = 0.1%

**Why it matters**: Error Budget acts as a buffer between reliability and velocity. It creates a natural feedback loop: unreliable services get less new features.

### Burn Rate
**What it is**: How fast we're consuming Error Budget.

**Calculation**: Burn Rate = error_consumed / error_budget_total

**Interpretation**:
- Burn Rate > 1.0: Consuming faster than allocated (danger zone)
- Burn Rate = 1.0: Consuming at exactly the allocated rate
- Burn Rate < 1.0: Consuming slower than allocated (safe zone)

**Why it matters**: High burn rate indicates urgent need to reduce error rate or slow feature velocity.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- .NET 8 SDK (for local development)
- Node.js 20+ (for local development)

### Running with Docker Compose

1. Clone the repository:
```bash
git clone <repository-url>
cd error-budget-generic
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the services:
- **Control Plane Dashboard**: http://localhost:3002
- **Swagger API Docs**: http://localhost:3002/api
- **Prometheus**: http://localhost:9091
- **Grafana**: http://localhost:3001 (admin/admin)
- **Evaluation Engine**: http://localhost:8080
- **Mock Metrics Service**: http://localhost:8084

### Initial Setup

1. **Create default policies** (via API or dashboard):
```bash
curl -X POST http://localhost:3002/api/policies \
  -H "Content-Type: application/json" \
  -d '{"threshold": 50, "action": "FULL_SPEED", "description": "Normal operations"}'

curl -X POST http://localhost:3002/api/policies \
  -H "Content-Type: application/json" \
  -d '{"threshold": 10, "action": "LIMITED", "description": "Reduce velocity"}'

curl -X POST http://localhost:3002/api/policies \
  -H "Content-Type: application/json" \
  -d '{"threshold": 0, "action": "FREEZE", "description": "Stop deployments"}'
```

2. **Create an SLI**:
```bash
curl -X POST http://localhost:3002/api/slis \
  -H "Content-Type: application/json" \
  -d '{
    "name": "availability",
    "type": "ratio",
    "goodQuery": "sum(rate(http_requests_total{status=~\"2..\"}[5m]))",
    "totalQuery": "sum(rate(http_requests_total[5m]))",
    "window": "30d"
  }'
```

3. **Create an SLO** (use the SLI ID from step 2):
```bash
curl -X POST http://localhost:3002/api/slos \
  -H "Content-Type: application/json" \
  -d '{
    "sliId": "<SLI_ID>",
    "target": 99.9,
    "window": "30d"
  }'
```

4. **Evaluate the SLO**:
```bash
curl -X POST http://localhost:3002/api/evaluation/slo/<SLO_ID>
```

## 📁 Project Structure

```
error-budget-generic/
├── evaluation-engine/          # .NET 8 Evaluation Engine
│   ├── Domain/                 # Domain entities, value objects, interfaces
│   ├── Application/             # Use cases and services
│   ├── Infrastructure/         # Prometheus client, external integrations
│   ├── Api/                    # REST API controllers and DTOs
│   └── README.md
├── control-plane/              # NestJS Control Plane
│   ├── src/
│   │   ├── entities/           # Database entities
│   │   ├── sli/                # SLI module
│   │   ├── slo/                # SLO module
│   │   ├── sla/                # SLA module
│   │   ├── policy/             # Policy module
│   │   ├── evaluation/         # Evaluation orchestration
│   │   ├── dashboard/          # Dashboard service
│   │   └── services/           # Shared services
│   ├── dashboard/              # React dashboard
│   └── README.md
├── mock-metrics-service/       # Mock service generating sample metrics
├── prometheus/                 # Prometheus configuration
└── docker-compose.yml          # Full stack orchestration
```

## 🔧 Configuration

### Environment Variables

#### Control Plane
- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_USERNAME`: Database username (default: postgres)
- `DB_PASSWORD`: Database password (default: postgres)
- `DB_DATABASE`: Database name (default: error_budget)
- `EVALUATION_ENGINE_URL`: Evaluation Engine URL (default: http://localhost:8080)
- `PROMETHEUS_URL`: Prometheus URL (default: http://localhost:9090)

#### Evaluation Engine
- `Prometheus__BaseUrl`: Prometheus base URL (default: http://localhost:9090)
- `Prometheus__TimeoutSeconds`: Query timeout (default: 30)

## 📊 Dashboard Features

- **Service Status**: Overall health indicator (🟢🟡🔴)
- **SLI Display**: Current SLI value vs SLO target
- **Error Budget Chart**: Visual representation of remaining budget
- **Burn Rate**: Current burn rate and policy status
- **SLA Risk**: SLA compliance and financial risk
- **Configuration Panel**: Dynamic SLI/SLO/SLA/Policy management

## 🧪 Testing

### Mock Metrics Service

The mock metrics service generates sample HTTP metrics. You can simulate errors:

```bash
# Increase error rate
curl http://localhost:8081/simulate-error

# Decrease error rate
curl http://localhost:8081/simulate-recovery
```

## 🎓 Learning Mode

This system includes extensive SRE learning comments throughout the codebase:

- **Why** decisions were made
- **What** problems SRE concepts solve
- **How** Error Budget balances reliability and velocity
- **When** to use SLI vs SLO vs SLA

Look for comments starting with `SRE NOTE:` in the code.

## 🚦 Operational Policies

Policies are applied automatically based on Error Budget remaining percentage:

- **FULL_SPEED** (>50%): Normal operations, full feature velocity
- **LIMITED** (10-50%): Reduce feature velocity, focus on reliability
- **FREEZE** (<10%): Stop all non-critical deployments

## 📚 Further Reading

- [Google SRE Book - SLIs, SLOs, SLAs](https://sre.google/sre-book/service-level-objectives/)
- [Error Budgets](https://sre.google/workbook/error-budget-policy/)
- [Implementing SLOs](https://sre.google/workbook/implementing-slos/)

## 🤝 Contributing

This is a learning/educational project. Contributions welcome!

## 📝 License

MIT
