import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {GoogleStrategy} from "../strategies/google.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: '12h'},
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy],
})

export class AuthModule {}