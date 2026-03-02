import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserLocationDto } from './dto/update-location.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req) {
    return await this.userService.getUser(req.user.user_id);
  }

  @Patch('location')
  @UseGuards(AuthGuard('jwt'))
  async editUserLocation(
    @Req() req,
    @Body() updateUserLocationDto: UpdateUserLocationDto,
  ) {
    const { country, city } = updateUserLocationDto;
    return await this.userService.editLocationInfo(
      req.user.user_id,
      country,
      city,
    );
  }
}
