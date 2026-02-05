import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SlaEntity } from './sla.entity';

/**
 * SLA Penalty Entity
 * 
 * SRE NOTE: SLA penalties define financial/business consequences of SLA violations.
 * These are stored for reporting and business intelligence, not operational decisions.
 */
@Entity('sla_penalties')
export class SlaPenaltyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  slaId: string;

  @ManyToOne(() => SlaEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'slaId' })
  sla: SlaEntity;

  @Column('decimal', { precision: 5, scale: 3 })
  threshold: number;

  @Column()
  impact: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
