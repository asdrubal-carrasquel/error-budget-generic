import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlaEntity } from '../entities/sla.entity';
import { SlaPenaltyEntity } from '../entities/sla-penalty.entity';
import { CreateSlaDto, UpdateSlaDto } from './dto/sla.dto';
import { SloService } from '../slo/slo.service';

/**
 * SLA Service
 * 
 * SRE NOTE: This service manages SLA definitions and penalties.
 * Remember: SLA is for business reporting, not operational decisions.
 */
@Injectable()
export class SlaService {
  constructor(
    @InjectRepository(SlaEntity)
    private slaRepository: Repository<SlaEntity>,
    @InjectRepository(SlaPenaltyEntity)
    private penaltyRepository: Repository<SlaPenaltyEntity>,
    private sloService: SloService,
  ) {}

  async create(createSlaDto: CreateSlaDto): Promise<SlaEntity> {
    // Validate SLO exists
    const slo = await this.sloService.findOne(createSlaDto.sloId);

    // Validate target is between 0 and 100
    if (createSlaDto.target < 0 || createSlaDto.target > 100) {
      throw new BadRequestException('SLA target must be between 0 and 100');
    }

    // SRE NOTE: SLA should typically be lower than SLO to create buffer
    // We warn but don't enforce this, as business requirements may vary
    if (createSlaDto.target > slo.target) {
      console.warn(
        `SLA target (${createSlaDto.target}%) is higher than SLO target (${slo.target}%). ` +
        `This removes the Error Budget buffer. Consider setting SLA < SLO.`
      );
    }

    const sla = this.slaRepository.create({
      sloId: createSlaDto.sloId,
      target: createSlaDto.target,
    });

    const savedSla = await this.slaRepository.save(sla);

    // Create penalties if provided
    if (createSlaDto.penalties && createSlaDto.penalties.length > 0) {
      const penalties = createSlaDto.penalties.map(penalty => 
        this.penaltyRepository.create({
          slaId: savedSla.id,
          threshold: penalty.threshold,
          impact: penalty.impact,
        })
      );
      await this.penaltyRepository.save(penalties);
    }

    return this.findOne(savedSla.id);
  }

  async findAll(): Promise<SlaEntity[]> {
    return this.slaRepository.find({ relations: ['slo', 'penalties'] });
  }

  async findOne(id: string): Promise<SlaEntity> {
    const sla = await this.slaRepository.findOne({
      where: { id },
      relations: ['slo', 'penalties'],
    });

    if (!sla) {
      throw new NotFoundException(`SLA with ID ${id} not found`);
    }

    return sla;
  }

  async update(id: string, updateSlaDto: UpdateSlaDto): Promise<SlaEntity> {
    const sla = await this.findOne(id);

    if (updateSlaDto.target !== undefined) {
      if (updateSlaDto.target < 0 || updateSlaDto.target > 100) {
        throw new BadRequestException('SLA target must be between 0 and 100');
      }
    }

    if (updateSlaDto.sloId) {
      await this.sloService.findOne(updateSlaDto.sloId);
    }

    Object.assign(sla, updateSlaDto);
    return this.slaRepository.save(sla);
  }

  async remove(id: string): Promise<void> {
    const sla = await this.findOne(id);
    await this.slaRepository.remove(sla);
  }
}
