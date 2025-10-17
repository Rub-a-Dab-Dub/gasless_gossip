import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  Post,
  ParseIntPipe,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { ChangePasswordDto, UpdateProfileDto } from './dtos/user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }
  @Get('profile/stats')
  getProfileStats(@Request() req) {
    return this.usersService.profileStats(req.user.userId);
  }

  @Put('profile')
  updateProfile(@Request() req, @Body() updateData: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, updateData);
  }

  @Post('change-password')
  changePassword(@Request() req, @Body() passwords: ChangePasswordDto) {
    return this.usersService.changePassword(
      req.user.userId,
      passwords.old_password,
      passwords.new_password,
    );
  }

  @Post(':id/follow')
  async followUser(
    @Param('id', ParseIntPipe) followedId: number,
    @Request() req,
  ) {
    const followerId = req.user.userId;
    return this.usersService.followUser(followerId, followedId);
  }

  @Delete(':id/unfollow')
  async unfollowUser(
    @Param('id', ParseIntPipe) followedId: number,
    @Request() req,
  ) {
    const followerId = req.user.userId;
    return this.usersService.unfollowUser(followerId, followedId);
  }

  @Get(':id/stats')
  async getUserStats(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.profileStats(userId);
  }

  @Get(':id')
  async viewUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Get('/profile/:username')
  async viewUserByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get(':id/followers')
  async listFollowers(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getFollowers(id);
  }

  @Get(':id/following')
  async listFollowing(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getFollowing(id);
  }

  @Post('logout')
  logout() {
    return {
      message: 'Logout successful on client side. Please delete your token.',
    };
  }
}
