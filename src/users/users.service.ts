import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}


  async findOne(login: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({where: { login }});
  }

  async createUser(data): Promise<any> {
    const user = await this.usersRepository.create(data);
    await this.usersRepository.save(user);
    return user;
  }
}
