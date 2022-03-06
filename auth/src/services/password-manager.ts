import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// from callback-based implementation to promise-based
const scryptAsync = promisify(scrypt);

export class PasswordManager {
  // static methods - can be called w/o creating an instance of its class
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buffer.toString('hex')}.${salt}`;
  }
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buffer.toString('hex') === hashedPassword;
  }
}
