import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { SliEntity } from './sli.entity';
import { SlaEntity } from './sla.entity';

/**
 * SLO Entity
 * 
 * SRE NOTE: Service Level Objective (SLO) is a target value for an SLI.
 * This is the internal reliability target that drives operational decisions.
 * 
 * Important: SLO should be tighter than SLA to create a buffer (Error Budget).
 * For example: SLO = 99.9%, SLA = 99.5% means we have 0.4% error budget buffer.
 */
@Entity('slos')
export class SloEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sliId: string;

  @ManyToOne(() => SliEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sliId' })
  sli: SliEntity;

  @Column('decimal', { precision: 5, scale: 3 })
  target: number;

  @Column({ default: '30d' })
  window: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => SlaEntity, (sla) => sla.slo)
  slas: SlaEntity[];
}
