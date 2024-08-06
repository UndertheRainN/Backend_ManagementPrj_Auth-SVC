import { compare, hash } from 'bcrypt';

import { isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'util';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';

@Injectable()
export class PasswordUtils {
  constructor(private configService: ConfigService) {}
  async compare(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  async hash(password: string): Promise<string> {
    if (isEmpty(password) || password.length < 8) {
      throw new Error('Password must be at least 8 characters.');
    }

    return hash(password, 10);
  }

  async compareKey(_password: string) {
    const key = (await promisify(scrypt)(
      this.configService.get<string>('PASSWORD_KEY'),
      'salt',
      32,
    )) as Buffer;
    const convertIv = await Buffer.from(
      this.configService.get<string>('IV_KEY'),
      'base64',
    );
    const decipher = createDecipheriv('aes-256-ctr', key, convertIv);
    const decryptedText = Buffer.concat([
      decipher.update(Buffer.from(_password, 'base64')),
      decipher.final(),
    ]);

    return decryptedText.toString();
  }

  async generatePassword(_password: string) {
    const convertIv = await Buffer.from(
      this.configService.get<string>('IV_KEY'),
      'base64',
    );
    const key = (await promisify(scrypt)(
      this.configService.get<string>('PASSWORD_KEY'),
      'salt',
      32,
    )) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, convertIv);
    const encryptedText = Buffer.concat([
      cipher.update(_password),
      cipher.final(),
    ]);
    return encryptedText.toString('base64');
  }
}
