import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PolicyEntity } from '../entities/policy.entity';
import { CreatePolicyDto, UpdatePolicyDto } from './dto/policy.dto';

/**
 * Policy Service
 * 
 * SRE NOTE: This service manages operational policies based on Error Budget remaining percentage.
 * Policies are applied automatically during evaluation to enforce Error Budget discipline.
 */
@Injectable()
export class PolicyService {
  constructor(
    @InjectRepository(PolicyEntity)
    private policyRepository: Repository<PolicyEntity>,
  ) {}

  async create(createPolicyDto: CreatePolicyDto): Promise<PolicyEntity> {
    // Validate threshold is between 0 and 100
    if (createPolicyDto.threshold < 0 || createPolicyDto.threshold > 100) {
      throw new BadRequestException('Policy threshold must be between 0 and 100');
    }

    const policy = this.policyRepository.create(createPolicyDto);
    return this.policyRepository.save(policy);
  }

  async findAll(): Promise<PolicyEntity[]> {
    // Return policies sorted by threshold (descending) so highest threshold is first
    return this.policyRepository.find({
      order: { threshold: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PolicyEntity> {
    const policy = await this.policyRepository.findOne({ where: { id } });

    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }

    return policy;
  }

  /**
   * Get the policy that applies to a given error budget remaining percentage
   * 
   * SRE NOTE: Policies are matched by threshold. The policy with the highest threshold
   * that is <= the remaining percentage is applied.
   */
  async getApplicablePolicy(errorBudgetRemainingPercentage: number): Promise<PolicyEntity | null> {
    const policies = await this.findAll();
    
    // Find the policy with the highest threshold that is <= remaining percentage
    const applicablePolicy = policies.find(
      policy => errorBudgetRemainingPercentage >= policy.threshold
    );

    return applicablePolicy || null;
  }

  async update(id: string, updatePolicyDto: UpdatePolicyDto): Promise<PolicyEntity> {
    const policy = await this.findOne(id);

    if (updatePolicyDto.threshold !== undefined) {
      if (updatePolicyDto.threshold < 0 || updatePolicyDto.threshold > 100) {
        throw new BadRequestException('Policy threshold must be between 0 and 100');
      }
    }

    Object.assign(policy, updatePolicyDto);
    return this.policyRepository.save(policy);
  }

  async remove(id: string): Promise<void> {
    const policy = await this.findOne(id);
    await this.policyRepository.remove(policy);
  }
}
