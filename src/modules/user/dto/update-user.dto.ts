import { IsString, IsNotEmpty, IsStrongPassword, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({
        example: 'John Doe',
        description: 'The name of the user',
      })
      @IsString()
      @IsOptional()
      name: string;
    
      @ApiProperty({
        example: 'Password@123',
        description: 'The password of the user',
      })
      @IsNotEmpty()
      @IsStrongPassword()
      @IsOptional()
      password: string;
}