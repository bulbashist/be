import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';
import * as COOKIE from 'src/constants/cookies';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UserRoleEnum } from 'src/users/entities/user-role.entity';
import { createTransport } from 'nodemailer';
import { UserRights } from 'src/users/entities/rights';

@Injectable()
export class AuthService {
  constructor(
    private _usersService: UsersService,
    private _jwtService: JwtService,
  ) {}

  private defaultCookieOpts: CookieOptions = {
    maxAge: 3600000,
    sameSite: 'none',
    httpOnly: true,
    secure: true,
  };

  async getUserData(token: string) {
    const { id, name, rights } = this._jwtService.decode(token) as any;
    const user = await this._usersService.findOneByID(id);
    if (user.isBlocked) return null;

    return { id, name, rights };
  }

  async logInGoogle(email: string) {
    let user = await this._usersService.findOne(email);

    if (!user) {
      user = await this._usersService.create({
        login: email,
        name: email,
        serviceOnly: true,
      });
    }

    if (user.isBlocked || !user.serviceOnly) {
      throw new ForbiddenException();
    }

    const accessToken = this.createToken(user);
    return accessToken;
  }

  async logIn(login: string, password: string) {
    const user = await this._usersService.findOne(login, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.isBlocked || user.serviceOnly) {
      throw new ForbiddenException();
    }

    const accessToken = this.createToken(user);
    return accessToken;
  }

  async signUp(login: string, password: string, name?: string) {
    try {
      await this._usersService.create({ login, password, name: name ?? login });
    } catch {
      throw new BadRequestException('User already exists');
    }
  }

  async signUpAsSeller(dto: CreateSellerDto) {
    try {
      await this._usersService.create({
        ...dto,
        role: { id: UserRoleEnum.Seller },
      });
    } catch {
      throw new BadRequestException('User already exists');
    }
  }

  private createToken(user: User) {
    const accessToken = this._jwtService.sign(
      {
        id: user.id,
        name: user.login,
        rights: user.role.rights,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: 3600 * 24,
      },
    );
    return accessToken;
  }

  setToken(res: Response, accessToken: string) {
    if (!accessToken) return res.status(403);

    res.cookie(COOKIE.ACCESS_TOKEN, accessToken, this.defaultCookieOpts);
    return res;
  }

  authorize(res: Response, accessToken: string) {
    this.setToken(res, accessToken).end();
  }

  authroizeAndRedirect(res: Response, accessToken: string) {
    this.setToken(res, accessToken).redirect(process.env.CLIENT_APP);
  }

  unauthorize(res: Response) {
    res.cookie(COOKIE.ACCESS_TOKEN, '', this.defaultCookieOpts).end();
  }

  async sendVerificationCode(email: string) {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: 'nbulbashist@gmail.com',
        pass: 'abzm lrmh ctpr rwrt',
      },
    });

    const mailOptions = {
      from: 'nbulbashist@gmail.com',
      to: email,
      subject: 'Verification code',
      text: '123123',
    };

    return transporter
      .sendMail(mailOptions)
      .then(() => true)
      .catch(() => false);
  }

  checkVerificationCode(email: string, code: string) {
    if (code === '123123') return true;
    return false;
  }
}
