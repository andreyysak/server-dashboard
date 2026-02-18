import {Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {GoogleStrategy} from "../common/strategies/google.strategy";
import {UserModule} from "../user/user.module";

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: '12h'},
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy],
})

export class AuthModule {}