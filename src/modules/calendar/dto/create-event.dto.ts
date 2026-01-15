// Bạn có thể cài thêm: npm i class-validator class-transformer
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class RepeatRuleDto {
  @IsEnum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

  @IsNumber()
  interval: number;

  @IsOptional()
  @IsDateString()
  until?: string;
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsDateString()
  startDate!: string; // Client gửi lên string ISO

  @IsDateString()
  endDate!: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => RepeatRuleDto)
  repeat?: RepeatRuleDto;
}
