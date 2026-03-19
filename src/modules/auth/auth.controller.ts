import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = await this.authService.validate(req.user);
    const jwt = this.authService.generateJwt(user);

    const userAgent = req.headers['user-agent'] || '';
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);

    let redirectUrl: string;

    if (isMobile) {
      const mobileUrl = process.env.MOBILE_URL || 'moonwatch://login-success';
      redirectUrl = `${mobileUrl}?token=${jwt}`;
    } else {
      const frontendUrl =
        process.env.FRONTEND_URL || 'http://localhost:3000/login-success';
      redirectUrl = `${frontendUrl}?token=${jwt}`;
    }

    return res.redirect(redirectUrl);
  }
}
