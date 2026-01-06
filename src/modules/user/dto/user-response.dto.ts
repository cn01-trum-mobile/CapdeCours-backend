import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../../entities/User';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'The unique ID of the user' })
  id: number;

  @ApiProperty({
    example: 'johndoe123',
    description: 'The username of the user',
  })
  username: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'The name of the user (optional)',
  })
  name?: string;

  @ApiProperty({
    description: 'The date and time the user was created',
    example: '2025-11-08T16:56:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the user was last updated',
    example: '2025-11-08T16:56:00.000Z',
  })
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.username = user.username;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
