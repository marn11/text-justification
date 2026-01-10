import { IsEmail } from 'class-validator';

export class TokenDto {
  @IsEmail()
  email: string;
}
