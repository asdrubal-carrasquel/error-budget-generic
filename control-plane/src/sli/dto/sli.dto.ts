import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSliDto {
  @ApiProperty({ example: 'availability' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ratio', default: 'ratio' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ example: 'sum(rate(http_requests_total{status=~"2.."}[5m]))' })
  @IsString()
  @IsNotEmpty()
  goodQuery: string;

  @ApiProperty({ example: 'sum(rate(http_requests_total[5m]))' })
  @IsString()
  @IsNotEmpty()
  totalQuery: string;

  @ApiProperty({ example: '30d', default: '30d' })
  @IsString()
  @IsOptional()
  window?: string;
}

export class UpdateSliDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  goodQuery?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  totalQuery?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  window?: string;
}
