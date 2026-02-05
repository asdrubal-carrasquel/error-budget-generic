import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Policy Entity
 * 
 * SRE NOTE: Operational policies define actions based on Error Budget remaining percentage.
 * 
 * These policies are config-driven and applied automatically:
 * - FULL_SPEED: Error budget > 50% remaining - normal operations
 * - LIMITED: Error budget 10-50% remaining - reduce feature velocity
 * - FREEZE: Error budget < 10% remaining - stop all non-critical deployments
 * 
 * Why policies matter:
 * - They enforce the Error Budget concept: unreliable services get less new features
 * - They prevent teams from ignoring reliability issues
 * - They create a natural feedback loop between reliability and velocity
 */
@Entity('policies')
export class PolicyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 5, scale: 2 })
  threshold: number;

  @Column()
  action: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
