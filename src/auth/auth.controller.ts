import { BadRequestException, Body, Controller, Header, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Cookies } from 'src/common/decorators/cookie.decorator';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LogInDTO } from './dto/logIn.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('/')
    async logIn(
        @Body() loginDTO: LogInDTO,
        @Req() req: Request, @Res({ passthrough: true }) response: Response) {

        try {
            let userData = await this.authService.login(req.user)
            console.log(userData)
            const { refresh, user, access_token } = userData
            console.log(refresh)
            response.cookie('refresh', refresh)
            return { user, access_token }
        } catch (err) {

        }
    }

    @Post('/refresh')
    async refresh(@Req() req: Request, @Cookies('refresh') refreshToken: string, @Res({ passthrough: true }) response: Response) {
        if (!refreshToken) {
            return {
                logged: false,
                message: "User not logged"
            }
        }
        try {
            const { access_token, refresh, user } = await this.authService.refreshToken(refreshToken)
            response.cookie('refresh', refresh)
            return {
                access_token,
                user,
                logged: true
            }
        } catch (err) {
            response.clearCookie('refresh')
            throw new BadRequestException(err.message)
        }




    }
}
