import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validate(details: any) {
    return await this.userService.findOrCreateUser({
      email: details.email,
      googleId: details.googleId,
      googleName: details.displayName,
      image: details.picture,
    });
  }

  generateJwt(user: User) {
    return this.jwtService.sign({
      id: user.user_id,
      email: user.email,
      role: user.role,
    });
  }
}
