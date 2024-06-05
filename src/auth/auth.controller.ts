import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { GoogleOAuthGuard } from './google/google.guard';
import { CreateSellerDto } from './dto/create-seller.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('user')
  getUserData(@Req() req: Request) {
    const token = req.cookies.accessToken;
    if (!token) return;

    const data = this.authService.getUserData(token);
    return data;
  }

  @Get('login-google')
  @UseGuards(GoogleOAuthGuard)
  async loginGoogle() {
    return;
  }

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async loginGoogleCallback(@Res() res: Response, @Req() req: Request) {
    const { email } = req.user as any;
    const accessToken = await this.authService.logInGoogle(email);
    this.authService.authroizeAndRedirect(res, accessToken);
  }

  @Post('send-vcode')
  async sendVerificationCode(@Body() { email }: { email: string }) {
    const res = await this.authService.sendVerificationCode(email);
    if (!res) throw new BadRequestException();
    return;
  }

  @Post('signup')
  async signUp(@Body() { login, password, name }: any, @Res() res: Response) {
    await this.authService.signUp(login, password, name);

    const accessToken = await this.authService.logIn(login, password);
    this.authService.authorize(res, accessToken);
  }

  @Post('seller/signup')
  async sellerSignUp(@Body() dto: CreateSellerDto, @Res() res: Response) {
    const ok = this.authService.checkVerificationCode(dto.login, dto.vcode);
    if (!ok) throw new UnauthorizedException();

    delete dto.vcode;
    await this.authService.signUpAsSeller(dto);
    const accessToken = await this.authService.logIn(dto.login, dto.password);
    this.authService.authorize(res, accessToken);
  }

  @Get('signout')
  signOut(@Res() res: Response) {
    this.authService.unauthorize(res);
  }

  @Post('login')
  async logIn(@Body() { login, password }: any, @Res() res: Response) {
    const accessToken = await this.authService.logIn(login, password);
    this.authService.authorize(res, accessToken);
  }
}
