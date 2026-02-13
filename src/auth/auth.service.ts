import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async validate(details: any) {
        let user = await this.userRepository.findOneBy({ email: details.email })

        if (!user) {
            user = this.userRepository.create({
                email: details.email,
                googleId: details.googleId,
                googleName: details.displayName,
                image: details.picture,
            })
            await this.userRepository.save(user)
        }

        return user
    }

    generateJwt(user: User) {
        return this.jwtService.sign({ id: user.user_id, email: user.email, role: user.role })
    }
}