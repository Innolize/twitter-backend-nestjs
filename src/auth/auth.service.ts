import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findFullUser(email)
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...rest } = user.toJSON()
            return rest
        }
        return null
    }

    async login(user: any) {
        const { _id, ...rest } = user
        const payload = { sub: _id }
        const access_token = this.jwtService.sign(payload)
        const refresh = await this.createRefreshToken(payload)
        return {
            user,
            access_token,
            refresh
        }
    }

    async createRefreshToken(id: { sub: string }) {
        return this.jwtService.sign(id, { secret: this.configService.get<string>('JWT_REFRESH_SECRET'), expiresIn: this.configService.get<string>('JWT_REFRESH_SECRET_EXPIRE') })
    }

    async refreshToken(refreshToken: string) {
        try {

            const token = this.jwtService.verify(refreshToken, { secret: this.configService.get<string>('JWT_REFRESH_SECRET') })
            const { sub } = token
            const payload = { sub }
            const access_token = this.jwtService.sign(payload)
            const refresh = this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_REFRESH_SECRET'), expiresIn: this.configService.get<string>('JWT_REFRESH_SECRET_EXPIRE') })
            const user = await this.userService.getUser(sub)

            return {
                access_token,
                refresh,
                user,
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
