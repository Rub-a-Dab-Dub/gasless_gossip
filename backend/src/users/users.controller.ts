import { Controller, Get, Headers } from '@nestjs/common';

@Controller('users')
export class UsersController {  // ✅ must be exactly this name
  @Get('me')
  getMe(@Headers('authorization') auth?: string) {
    return { id: '123', name: 'TestUser', token: auth || null };
  }
}
