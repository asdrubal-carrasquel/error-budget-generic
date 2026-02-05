import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SloEntity } from './slo.entity';

/**
 * Evaluation History Entity
 * 
 * SRE NOTE: This entity stores historical evaluation results for:
 * - Trend analysis
 * - Dashboard visualization
 * - Post-mortem analysis
 * - Compliance reporting
 * 
 * Storing history allows us to:
 * - Track Error Budget consumption over time
 * - Identify patterns in reliability
 * - Correlate incidents with Error Budget impact
 */
@Entity('evaluation_history')
export class EvaluationHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sloId: string;

  @ManyToOne(() => SloEntity)
  @JoinColumn({ name: 'sloId' })
  slo: SloEntity;

  @Column('decimal', { precision: 10, scale: 6 })
  sliValue: number;

  @Column('decimal', { precision: 10, scale: 6 })
  errorBudgetRemaining: number;

  @Column('decimal', { precision: 10, scale: 6 })
  burnRate: number;

  @Column()
  sloMet: boolean;

  @Column({ nullable: true })
  slaMet: boolean;

  @Column()
  appliedPolicy: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  evaluatedAt: Date;
}
