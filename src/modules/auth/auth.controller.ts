import {Controller, Get, Req, Res, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthGuard} from "@nestjs/passport";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const user = await this.authService.validate(req.user);
        const jwt = this.authService.generateJwt(user);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000/login-success';

        const redirectUrl = `${frontendUrl}?token=${jwt}`;

        return res.redirect(redirectUrl);
    }
}