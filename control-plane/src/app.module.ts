import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SliModule } from './sli/sli.module';
import { SloModule } from './slo/slo.module';
import { SlaModule } from './sla/sla.module';
import { PolicyModule } from './policy/policy.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { SliEntity } from './entities/sli.entity';
import { SloEntity } from './entities/slo.entity';
import { SlaEntity } from './entities/sla.entity';
import { SlaPenaltyEntity } from './entities/sla-penalty.entity';
import { PolicyEntity } from './entities/policy.entity';
import { EvaluationHistoryEntity } from './entities/evaluation-history.entity';
import { PrometheusValidationService } from './services/prometheus-validation.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'error_budget'),
        entities: [
          SliEntity,
          SloEntity,
          SlaEntity,
          SlaPenaltyEntity,
          PolicyEntity,
          EvaluationHistoryEntity,
        ],
        synchronize: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    SliModule,
    SloModule,
    SlaModule,
    PolicyModule,
    DashboardModule,
    EvaluationModule,
  ],
  providers: [PrometheusValidationService],
})
export class AppModule {}
