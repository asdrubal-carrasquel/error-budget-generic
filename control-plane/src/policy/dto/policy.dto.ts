import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePolicyDto {
  @ApiProperty({ example: 50, description: 'Error budget remaining percentage threshold' })
  @IsNumber()
  @IsNotEmpty()
  threshold: number;

  @ApiProperty({ example: 'FULL_SPEED', description: 'Policy action (FULL_SPEED, LIMITED, FREEZE)' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({ required: false, example: 'Normal operations - full feature velocity allowed' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePolicyDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  threshold?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  action?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
