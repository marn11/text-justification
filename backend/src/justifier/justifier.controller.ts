import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JustifierService } from './justifier.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('justify')
@UseGuards(AuthGuard)
export class JustifierController {
  constructor(private justifierService: JustifierService) {}
  @Post()
  justify(@Body() text: string) {
    return this.justifierService.justify(text);
  }
}
