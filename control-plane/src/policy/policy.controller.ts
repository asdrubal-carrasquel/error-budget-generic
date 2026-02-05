import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PolicyService } from './policy.service';
import { CreatePolicyDto, UpdatePolicyDto } from './dto/policy.dto';

@ApiTags('Policies')
@Controller('policies')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new operational policy' })
  create(@Body() createPolicyDto: CreatePolicyDto) {
    return this.policyService.create(createPolicyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all operational policies' })
  findAll() {
    return this.policyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get policy by ID' })
  findOne(@Param('id') id: string) {
    return this.policyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update policy' })
  update(@Param('id') id: string, @Body() updatePolicyDto: UpdatePolicyDto) {
    return this.policyService.update(id, updatePolicyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete policy' })
  remove(@Param('id') id: string) {
    return this.policyService.remove(id);
  }
}
