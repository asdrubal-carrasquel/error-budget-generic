import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SliEntity } from '../entities/sli.entity';
import { CreateSliDto, UpdateSliDto } from './dto/sli.dto';
import { PrometheusValidationService } from '../services/prometheus-validation.service';

/**
 * SLI Service
 * 
 * SRE NOTE: This service handles CRUD operations for SLI definitions.
 * It validates PromQL queries before saving to prevent configuration errors.
 */
@Injectable()
export class SliService {
  constructor(
    @InjectRepository(SliEntity)
    private sliRepository: Repository<SliEntity>,
    private prometheusValidationService: PrometheusValidationService,
  ) {}

  async create(createSliDto: CreateSliDto): Promise<SliEntity> {
    // Validate PromQL queries
    await this.prometheusValidationService.validateQueries(
      createSliDto.goodQuery,
      createSliDto.totalQuery,
    );

    const sli = this.sliRepository.create(createSliDto);
    return this.sliRepository.save(sli);
  }

  async findAll(): Promise<SliEntity[]> {
    return this.sliRepository.find({ relations: ['slos'] });
  }

  async findOne(id: string): Promise<SliEntity> {
    const sli = await this.sliRepository.findOne({
      where: { id },
      relations: ['slos'],
    });

    if (!sli) {
      throw new NotFoundException(`SLI with ID ${id} not found`);
    }

    return sli;
  }

  async update(id: string, updateSliDto: UpdateSliDto): Promise<SliEntity> {
    const sli = await this.findOne(id);

    // Validate PromQL queries if they're being updated
    if (updateSliDto.goodQuery || updateSliDto.totalQuery) {
      const goodQuery = updateSliDto.goodQuery ?? sli.goodQuery;
      const totalQuery = updateSliDto.totalQuery ?? sli.totalQuery;
      await this.prometheusValidationService.validateQueries(goodQuery, totalQuery);
    }

    Object.assign(sli, updateSliDto);
    return this.sliRepository.save(sli);
  }

  async remove(id: string): Promise<void> {
    const sli = await this.findOne(id);
    await this.sliRepository.remove(sli);
  }
}
