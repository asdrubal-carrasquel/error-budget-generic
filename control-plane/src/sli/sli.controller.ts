import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SliService } from './sli.service';
import { CreateSliDto, UpdateSliDto } from './dto/sli.dto';

@ApiTags('SLIs')
@Controller('slis')
export class SliController {
  constructor(private readonly sliService: SliService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SLI definition' })
  create(@Body() createSliDto: CreateSliDto) {
    return this.sliService.create(createSliDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SLI definitions' })
  findAll() {
    return this.sliService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get SLI definition by ID' })
  findOne(@Param('id') id: string) {
    return this.sliService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update SLI definition' })
  update(@Param('id') id: string, @Body() updateSliDto: UpdateSliDto) {
    return this.sliService.update(id, updateSliDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete SLI definition' })
  remove(@Param('id') id: string) {
    return this.sliService.remove(id);
  }
}
