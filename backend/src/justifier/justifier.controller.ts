import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JustifierService } from './justifier.service';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Justification')
@ApiBearerAuth()
@Controller('justify')
@UseGuards(AuthGuard)
export class JustifierController {
  constructor(private justifierService: JustifierService) {}

  @Post()
  @ApiOperation({
    summary: 'Justify text to 80 characters per line',
    description:
      'Accepts raw text and returns a justified version with lines of exactly 80 characters. Paragraphs are preserved.',
  })
  @ApiConsumes('text/plain')
  @ApiBody({
    description: 'Raw text to justify',
    schema: {
      type: 'string',
      example:
        'This is an example text that will be justified to exactly eighty characters per line.',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Text successfully justified',
    schema: {
      type: 'string',
      example:
        'This  is  an example text that will be justified to exactly eighty\ncharacters per line.',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Missing or empty text body',
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or invalid authentication token',
  })
  @ApiResponse({
    status: 402,
    description: 'Daily quota of 80,000 words exceeded',
  })
  justify(@Body() text: string) {
    return this.justifierService.justify(text);
  }
}
