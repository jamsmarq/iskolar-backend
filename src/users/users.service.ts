import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: '1',
      username: 'helloworld',
      password: 'helloworld',
    },
    {
      userId: '2',
      username: 'admin',
      password: 'admin123',
    }
  ]

  async findOne(username: string): Promise<any | undefined> {
    return this.users.find(user => user.username === username);
  }
}
