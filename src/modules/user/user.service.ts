import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from './enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOrCreateUser(details: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: details.email });

    if (user) {
      if (!user.googleId) {
        user.googleId = details.googleId;
        user.googleName = details.googleName;
        user.image = details.image ?? user.image;
        return await this.userRepository.save(user);
      }
      return user;
    }

    const newUser = this.userRepository.create({
      ...details,
      role: UserRole.USER,
    });

    return await this.userRepository.save(newUser);
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Not found user with ${userId} ID`);
    }

    return user;
  }

  async editLocationInfo(
    userId: number,
    country?: string,
    city?: string,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({
      user_id: userId,
    });

    if (!user) {
      throw new NotFoundException(`Not found user with ${userId} ID`);
    }

    try {
      user.country = country ?? user.country;
      user.city = city ?? user.city;

      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update location: ${error.message}`,
      );
    }
  }
}
