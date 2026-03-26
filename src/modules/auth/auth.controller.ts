import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @ApiOperation({
    summary: 'Redirect to Google login',
    description: 'Pass redirect_uri in query for dynamic redirection after login',
  })
  @ApiQuery({ name: 'redirect_uri', required: false })
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req, @Query('redirect_uri') redirectUri?: string) {
    // Passport handles the redirect to Google.
    // The state parameter can be used to pass the redirect_uri to the callback.
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google auth callback' })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res, @Query('state') state?: string) {
    const user = await this.authService.validate(req.user);
    const jwt = this.authService.generateJwt(user);

    let redirectUrl: string;

    // 1. Check if redirect_uri was passed in state (from frontend)
    if (state) {
      try {
        const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
        if (decodedState.redirect_uri) {
          this.validateRedirectUri(decodedState.redirect_uri);
          redirectUrl = decodedState.redirect_uri;
        }
      } catch (e) {
        // Fallback if state is not JSON or base64
      }
    }

    // 2. Fallback to default logic if no valid redirect_uri in state
    if (!redirectUrl) {
      const userAgent = req.headers['user-agent'] || '';
      const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);

      if (isMobile) {
        redirectUrl = process.env.MOBILE_REDIRECT_URL || 'moonwatch://login-success';
      } else {
        redirectUrl = process.env.FRONTEND_REDIRECT_URL || 'http://localhost:5187/login-success';
      }
    }

    // Append token to the redirect URL
    const separator = redirectUrl.includes('?') ? '&' : '?';
    return res.redirect(`${redirectUrl}${separator}token=${jwt}`);
  }

  private validateRedirectUri(uri: string) {
    const allowedOrigins = process.env.ALLOWED_REDIRECT_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'http://localhost:5187',
      'http://8.211.44.164',
    ];

    const isAllowed = allowedOrigins.some((origin) => uri.startsWith(origin)) || 
                      uri.startsWith('moonwatch://') || 
                      uri.startsWith('exp://');
    
    if (!isAllowed) {
      throw new BadRequestException('Invalid redirect URI');
    }
  }
}
