import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenDto } from './dto/newtoken.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('token')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post()
  @ApiOperation({
    summary: 'Generate or retrieve an authentication token',
    description:
      'Return a unique token associated with the provided email. If the email already exists, the existing token is returned.',
  })
  @ApiBody({ type: TokenDto })
  @ApiResponse({
    status: 201,
    description: 'Token sucessfully generated or retrieved',
    schema: {
      example: {
        token: '550e8400-e29b-41d4-a716-446655440000',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email format',
  })
  create(@Body() tokenDto: TokenDto) {
    return this.authService.getToken(tokenDto.email);
  }
}
