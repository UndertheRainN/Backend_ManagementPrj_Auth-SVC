import { Module } from '@nestjs/common';
import { PasswordUtils } from './password.util';

@Module({
  exports: [PasswordUtils],
  providers: [PasswordUtils],
})
export class UtilsModule {}
