import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Post('register')
  async register(@Body() body: { username: string; password: string; role?: any }) {
    return this.authService.register(body.username, body.password, body.role);
  }

  @Get('seed')
  async seed() {
    return this.authService.seed();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile() {
    return { message: 'Authenticated' };
  }
}
