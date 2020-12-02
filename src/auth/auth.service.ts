import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        console.log(email)
        const user = await this.userService.findOne(email)
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...rest } = user.toJSON()
            return rest
        }
        return null
    }

    async login(user: any) {
        console.log(user)
       const {_id, ...rest} = user
       const payload = {sub: _id}
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
