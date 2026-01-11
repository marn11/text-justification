import { Module } from '@nestjs/common';
import { JustifierController } from './justifier.controller';
import { JustifierService } from './justifier.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [JustifierController],
  providers: [JustifierService],
})
export class JustifierModule {}
