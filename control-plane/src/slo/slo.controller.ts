import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SloService } from './slo.service';
import { CreateSloDto, UpdateSloDto } from './dto/slo.dto';

@ApiTags('SLOs')
@Controller('slos')
export class SloController {
  constructor(private readonly sloService: SloService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SLO definition' })
  create(@Body() createSloDto: CreateSloDto) {
    return this.sloService.create(createSloDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SLO definitions' })
  findAll() {
    return this.sloService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get SLO definition by ID' })
  findOne(@Param('id') id: string) {
    return this.sloService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update SLO definition' })
  update(@Param('id') id: string, @Body() updateSloDto: UpdateSloDto) {
    return this.sloService.update(id, updateSloDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete SLO definition' })
  remove(@Param('id') id: string) {
    return this.sloService.remove(id);
  }
}
