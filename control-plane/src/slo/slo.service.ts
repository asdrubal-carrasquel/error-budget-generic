import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SloEntity } from '../entities/slo.entity';
import { CreateSloDto, UpdateSloDto } from './dto/slo.dto';
import { SliService } from '../sli/sli.service';

/**
 * SLO Service
 * 
 * SRE NOTE: This service manages SLO definitions linked to SLIs.
 * It ensures SLO targets are valid (0-100) and linked to existing SLIs.
 */
@Injectable()
export class SloService {
  constructor(
    @InjectRepository(SloEntity)
    private sloRepository: Repository<SloEntity>,
    private sliService: SliService,
  ) {}

  async create(createSloDto: CreateSloDto): Promise<SloEntity> {
    // Validate SLI exists
    await this.sliService.findOne(createSloDto.sliId);

    // Validate target is between 0 and 100
    if (createSloDto.target < 0 || createSloDto.target > 100) {
      throw new BadRequestException('SLO target must be between 0 and 100');
    }

    const slo = this.sloRepository.create(createSloDto);
    return this.sloRepository.save(slo);
  }

  async findAll(): Promise<SloEntity[]> {
    return this.sloRepository.find({ relations: ['sli', 'slas'] });
  }

  async findOne(id: string): Promise<SloEntity> {
    const slo = await this.sloRepository.findOne({
      where: { id },
      relations: ['sli', 'slas'],
    });

    if (!slo) {
      throw new NotFoundException(`SLO with ID ${id} not found`);
    }

    return slo;
  }

  async update(id: string, updateSloDto: UpdateSloDto): Promise<SloEntity> {
    const slo = await this.findOne(id);

    if (updateSloDto.target !== undefined) {
      if (updateSloDto.target < 0 || updateSloDto.target > 100) {
        throw new BadRequestException('SLO target must be between 0 and 100');
      }
    }

    if (updateSloDto.sliId) {
      await this.sliService.findOne(updateSloDto.sliId);
    }

    Object.assign(slo, updateSloDto);
    return this.sloRepository.save(slo);
  }

  async remove(id: string): Promise<void> {
    const slo = await this.findOne(id);
    await this.sloRepository.remove(slo);
  }
}
