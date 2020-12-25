import { BadRequestException, Body, Controller, Header, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Cookies } from 'src/common/decorators/cookie.decorator';
import { AuthService } from './auth.service';
import { LogInDTO } from './dto/logIn.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

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
    async refresh(@Cookies('refresh') refreshToken: string, @Res({ passthrough: true }) response: Response) {
        if (!refreshToken) {
            console.log('no hay token!')
            throw new UnauthorizedException()
        }
        try {
            const { access_token, refresh } = await this.authService.refreshToken(refreshToken)
            console.log("test")
            response.cookie('refresh', refresh)
            return { access_token }
        } catch (err) {
            response.clearCookie('refresh')
            throw new BadRequestException(err.message)
        }




    }
}
