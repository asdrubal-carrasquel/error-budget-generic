import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlaController } from './sla.controller';
import { SlaService } from './sla.service';
import { SlaEntity } from '../entities/sla.entity';
import { SlaPenaltyEntity } from '../entities/sla-penalty.entity';
import { SloModule } from '../slo/slo.module';

@Module({
  imports: [TypeOrmModule.forFeature([SlaEntity, SlaPenaltyEntity]), SloModule],
  controllers: [SlaController],
  providers: [SlaService],
  exports: [SlaService],
})
export class SlaModule {}
