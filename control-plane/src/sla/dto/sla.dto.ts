import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SlaPenaltyDto {
  @ApiProperty({ example: 99.0 })
  @IsNumber()
  @IsNotEmpty()
  threshold: number;

  @ApiProperty({ example: 'CREDIT_10' })
  @IsString()
  @IsNotEmpty()
  impact: string;
}

export class CreateSlaDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  sloId: string;

  @ApiProperty({ example: 99.5 })
  @IsNumber()
  @IsNotEmpty()
  target: number;

  @ApiProperty({ type: [SlaPenaltyDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SlaPenaltyDto)
  penalties?: SlaPenaltyDto[];
}

export class UpdateSlaDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  sloId?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  target?: number;
}
