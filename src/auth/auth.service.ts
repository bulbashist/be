import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Response } from 'express';
import * as COOKIE from 'src/constants/cookies';

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

  getUserData(token: string) {
    const { id, name, rights } = this._jwtService.decode(token) as any;
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

    const accessToken = this.createToken(user);
    return accessToken;
  }

  async logIn(login: string, password: string) {
    const user = await this._usersService.findOne(login, password);
    if (!user) {
      throw new UnauthorizedException();
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

  async signUpAsSeller(login: string, password: string, name?: string) {
    try {
      await this._usersService.create({ login, password, name: name ?? login });
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
        expiresIn: 3600,
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
}
