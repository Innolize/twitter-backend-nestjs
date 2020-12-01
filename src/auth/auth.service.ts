import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.logIn(email)
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...rest } = user.toJSON()
            return rest
        }
        return null
    }
}
