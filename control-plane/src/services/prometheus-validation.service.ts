import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

/**
 * Prometheus Validation Service
 * 
 * SRE NOTE: This service validates PromQL queries before saving SLI definitions.
 * It prevents configuration errors by testing queries against Prometheus.
 * 
 * Why validate before saving:
 * - Catches syntax errors early
 * - Prevents invalid queries from being stored
 * - Provides immediate feedback to users
 */
@Injectable()
export class PrometheusValidationService {
  private readonly prometheusUrl: string;

  constructor(private configService: ConfigService) {
    // Get Prometheus URL from Evaluation Engine config or direct Prometheus
    this.prometheusUrl = this.configService.get('PROMETHEUS_URL', 'http://localhost:9090');
  }

  async validateQueries(goodQuery: string, totalQuery: string): Promise<void> {
    const errors: string[] = [];

    // Validate good query
    try {
      await this.validateQuery(goodQuery);
    } catch (error) {
      errors.push(`Good query validation failed: ${error.message}`);
    }

    // Validate total query
    try {
      await this.validateQuery(totalQuery);
    } catch (error) {
      errors.push(`Total query validation failed: ${error.message}`);
    }

    if (errors.length > 0) {
      throw new BadRequestException(`PromQL validation failed:\n${errors.join('\n')}`);
    }
  }

  private async validateQuery(query: string): Promise<void> {
    // SRE NOTE: We validate by attempting a query with a small time range
    // Prometheus will return an error if the query is invalid
    const now = Math.floor(Date.now() / 1000);
    const past = now - 300; // 5 minutes ago

    try {
      const response = await axios.get(`${this.prometheusUrl}/api/v1/query_range`, {
        params: {
          query: query,
          start: past,
          end: now,
          step: '15s',
        },
        timeout: 5000,
      });

      if (response.data.status !== 'success') {
        throw new Error(response.data.error || 'Unknown Prometheus error');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.error) {
          throw new Error(error.response.data.error);
        }
        throw new Error(`Failed to connect to Prometheus: ${error.message}`);
      }
      throw error;
    }
  }
}
