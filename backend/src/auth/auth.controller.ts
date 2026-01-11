import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenDto } from './dto/newtoken.dto';

@Controller('token')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post()
  create(@Body() tokenDto: TokenDto) {
    return this.authService.getToken(tokenDto.email);
  }
}
