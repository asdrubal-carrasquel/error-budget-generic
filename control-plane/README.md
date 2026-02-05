# Control Plane

NestJS application responsible for configuration management, evaluation orchestration, and serving the React dashboard.

## 🏗️ Architecture

```
src/
├── entities/           # TypeORM database entities
├── sli/               # SLI management module
├── slo/               # SLO management module
├── sla/               # SLA management module
├── policy/            # Policy management module
├── evaluation/        # Evaluation orchestration
├── dashboard/         # Dashboard service and React app
└── services/          # Shared services (Prometheus validation)
```

## 🗄️ Database Schema

### SLI Entity
Stores SLI definitions with PromQL queries.

### SLO Entity
Stores SLO targets linked to SLIs.

### SLA Entity
Stores SLA targets and penalties (business contracts).

### Policy Entity
Stores operational policies based on Error Budget thresholds.

### Evaluation History Entity
Stores historical evaluation results for trend analysis.

## 🔌 API Endpoints

### SLI Management

```http
POST   /api/slis              # Create SLI
GET    /api/slis              # List all SLIs
GET    /api/slis/:id          # Get SLI by ID
PATCH  /api/slis/:id          # Update SLI
DELETE /api/slis/:id          # Delete SLI
```

### SLO Management

```http
POST   /api/slos              # Create SLO
GET    /api/slos              # List all SLOs
GET    /api/slos/:id          # Get SLO by ID
PATCH  /api/slos/:id          # Update SLO
DELETE /api/slos/:id          # Delete SLO
```

### SLA Management

```http
POST   /api/slas              # Create SLA
GET    /api/slas              # List all SLAs
GET    /api/slas/:id          # Get SLA by ID
PATCH  /api/slas/:id          # Update SLA
DELETE /api/slas/:id          # Delete SLA
```

### Policy Management

```http
POST   /api/policies          # Create policy
GET    /api/policies          # List all policies
GET    /api/policies/:id      # Get policy by ID
PATCH  /api/policies/:id      # Update policy
DELETE /api/policies/:id      # Delete policy
```

### Evaluation

```http
POST   /api/evaluation/slo/:sloId    # Evaluate specific SLO
POST   /api/evaluation/all            # Evaluate all SLOs
GET    /api/evaluation/history/:sloId # Get evaluation history
```

### Dashboard

```http
GET    /api/dashboard         # Get aggregated dashboard data
```

## 🎨 React Dashboard

The dashboard is served as static files from the NestJS application.

### Features

- **Service Status**: Overall health indicator
- **SLI Display**: Current SLI vs SLO target
- **Error Budget Chart**: Visual representation
- **Burn Rate**: Current burn rate and policy
- **SLA Risk**: SLA compliance status
- **Configuration Panel**: Dynamic configuration

### Building the Dashboard

```bash
cd dashboard
npm install
npm run build
```

The build output is served from `dashboard/build/`.

## 🔧 Configuration

### Environment Variables

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=error_budget
EVALUATION_ENGINE_URL=http://localhost:8080
PROMETHEUS_URL=http://localhost:9090
PORT=3000
NODE_ENV=development
```

### Database Setup

The application uses TypeORM with PostgreSQL. In development mode, `synchronize: true` automatically creates/updates the schema.

For production, use migrations:

```bash
npm run typeorm migration:generate -- -n InitialMigration
npm run typeorm migration:run
```

## 🧪 Testing

### Local Development

1. Start PostgreSQL:
```bash
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm run start:dev
```

4. Access Swagger docs:
http://localhost:3000/api

## 🎓 SRE Learning Points

### Why Configuration-Driven?

1. **No Code Changes**: SLIs/SLOs/SLAs can be configured without deploying code
2. **Rapid Iteration**: Teams can experiment with different targets
3. **Multi-Tenant**: Different services can have different configurations
4. **Audit Trail**: Configuration changes are tracked in the database

### Why Separate Control Plane and Evaluation Engine?

1. **Separation of Concerns**: Configuration vs. computation
2. **Scalability**: Can scale evaluation engine independently
3. **Language Flexibility**: Each component can use the best language for its purpose
4. **Testing**: Easier to test configuration logic separately from evaluation logic

### Policy Application

Policies are applied automatically based on Error Budget remaining percentage:

- **FULL_SPEED** (>50%): Normal operations
- **LIMITED** (10-50%): Reduce velocity
- **FREEZE** (<10%): Stop deployments

**SRE NOTE**: Policies enforce Error Budget discipline. Without policies, teams might ignore reliability issues.

## 🚀 Deployment

### Docker

```bash
docker build -t control-plane ./control-plane
docker run -p 3000:3000 \
  -e DB_HOST=postgres \
  -e EVALUATION_ENGINE_URL=http://evaluation-engine:8080 \
  control-plane
```

### Production Considerations

1. **Database Migrations**: Use migrations instead of `synchronize: true`
2. **Environment Variables**: Use secrets management
3. **CORS**: Configure CORS for production domains
4. **Rate Limiting**: Add rate limiting for API endpoints
5. **Authentication**: Add authentication/authorization (not included in this version)

## 📚 Further Reading

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Error Budgets](https://sre.google/workbook/error-budget-policy/)
