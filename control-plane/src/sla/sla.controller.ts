import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SlaService } from './sla.service';
import { CreateSlaDto, UpdateSlaDto } from './dto/sla.dto';

@ApiTags('SLAs')
@Controller('slas')
export class SlaController {
  constructor(private readonly slaService: SlaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SLA definition' })
  create(@Body() createSlaDto: CreateSlaDto) {
    return this.slaService.create(createSlaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SLA definitions' })
  findAll() {
    return this.slaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get SLA definition by ID' })
  findOne(@Param('id') id: string) {
    return this.slaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update SLA definition' })
  update(@Param('id') id: string, @Body() updateSlaDto: UpdateSlaDto) {
    return this.slaService.update(id, updateSlaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete SLA definition' })
  remove(@Param('id') id: string) {
    return this.slaService.remove(id);
  }
}
