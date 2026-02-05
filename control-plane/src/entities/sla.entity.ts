import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { SloEntity } from './slo.entity';
import { SlaPenaltyEntity } from './sla-penalty.entity';

/**
 * SLA Entity
 * 
 * SRE NOTE: Service Level Agreement (SLA) is a business contract with customers.
 * 
 * CRITICAL: SLA should NOT guide operational decisions. Use SLO and Error Budget instead.
 * 
 * Why this matters:
 * - SLA violations are business problems (financial penalties, contract issues)
 * - SLO violations are engineering problems (operational actions needed)
 * - If we meet SLO, we automatically meet SLA (assuming SLO > SLA)
 */
@Entity('slas')
export class SlaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sloId: string;

  @ManyToOne(() => SloEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sloId' })
  slo: SloEntity;

  @Column('decimal', { precision: 5, scale: 3 })
  target: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => SlaPenaltyEntity, (penalty) => penalty.sla, { cascade: true })
  penalties: SlaPenaltyEntity[];
}
