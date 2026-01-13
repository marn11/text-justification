import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email used to generate or retrieve token',
  })
  @IsEmail()
  email: string;
}
