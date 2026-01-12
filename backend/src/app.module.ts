import { Module } from '@nestjs/common';
import { JustifierModule } from './justifier/justifier.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [JustifierModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
