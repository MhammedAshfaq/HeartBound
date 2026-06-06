import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(body: any) {
    return { message: 'Login endpoint - coming soon' };
  }

  async register(body: any) {
    return { message: 'Register endpoint - coming soon' };
  }
}
