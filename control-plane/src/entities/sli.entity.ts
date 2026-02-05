import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SloEntity } from './slo.entity';

/**
 * SLI Entity
 * 
 * SRE NOTE: Service Level Indicator (SLI) is a quantitative measure of service quality.
 * This entity stores SLI definitions that can be dynamically configured without code changes.
 * 
 * Key design decisions:
 * - PromQL queries are stored as strings (allows dynamic configuration)
 * - Window is stored as string (e.g., "30d") for flexibility
 * - Type field allows future extension to different SLI calculation methods
 */
@Entity('slis')
export class SliEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: 'ratio' })
  type: string;

  @Column('text')
  goodQuery: string;

  @Column('text')
  totalQuery: string;

  @Column({ default: '30d' })
  window: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => SloEntity, (slo) => slo.sli)
  slos: SloEntity[];
}
