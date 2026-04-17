import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string, role: UserRole = UserRole.EMPLOYEE) {
    const existing = await this.userRepository.findOne({ where: { username } });
    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
    });
    await this.userRepository.save(user);
    const { password: _, ...result } = user;
    return result;
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async validateUser(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async seed() {
    const count = await this.userRepository.count();
    if (count === 0) {
      await this.register('admin', 'admin123', UserRole.ADMIN);
      await this.register('hr', 'hr123', UserRole.HR);
      return { message: 'Default users created: admin/admin123, hr/hr123' };
    }
    return { message: 'Users already exist' };
  }
}
