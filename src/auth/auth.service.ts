import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserDto } from '../users/user.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async login(data: UserDto): Promise<HttpException | { login: string }> {
    const user = await this.usersService.findOne(data.login);
    if (user && await AuthService.passwordsAreEqual(user.password, data.password)) {
      return {
        login: user.login
      };
    }
    throw new HttpException({status: HttpStatus.FORBIDDEN, message: 'This password or email is not correct'}, 401);
  }

  async register(data: UserDto): Promise<HttpException | { login: string }> {
    let user = await this.usersService.findOne(data.login);
    if (user) {
      throw new HttpException({status: HttpStatus.FORBIDDEN, message: 'This username already exist'}, 403);
    }
    user = await this.usersService.createUser(data);
    return {
      login: user.login
    };
  }

  private static async passwordsAreEqual(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
