import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const password = 'b4oHl2bGhzh9ttcBN5444zWS/3FFsLHaS50nH/ydOkM=';
const iv = 'pVRRzjjvHcStpZl386Wv8Q==';
export const compareKey = async (value: string): Promise<string> => {
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  const convertIv = await Buffer.from(iv, 'base64');
  const decipher = createDecipheriv('aes-256-ctr', key, convertIv);
  const decryptedText = Buffer.concat([
    decipher.update(Buffer.from(value, 'base64')),
    decipher.final(),
  ]);

  return decryptedText.toString();
};

export const generatePassword = async (value: string): Promise<string> => {
  const convertIv = await Buffer.from(iv, 'base64');
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  const cipher = createCipheriv('aes-256-ctr', key, convertIv);
  const encryptedText = Buffer.concat([cipher.update(value), cipher.final()]);
  return encryptedText.toString('base64');
};
