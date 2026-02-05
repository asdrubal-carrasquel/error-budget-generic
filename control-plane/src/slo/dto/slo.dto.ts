import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSloDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  sliId: string;

  @ApiProperty({ example: 99.9 })
  @IsNumber()
  @IsNotEmpty()
  target: number;

  @ApiProperty({ example: '30d', default: '30d' })
  @IsString()
  @IsOptional()
  window?: string;
}

export class UpdateSloDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  sliId?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  target?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  window?: string;
}
