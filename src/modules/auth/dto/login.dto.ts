import { IsString, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe123',
    description: 'The username of the user',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
