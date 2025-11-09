import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Post,
  ParseIntPipe,
  Param,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { ChangePasswordDto, UpdateProfileDto } from './dtos/user.dto';
import {
  CurrentUser,
  CurrentUserData,
} from '@/common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: CurrentUserData) {
    return this.usersService.findById(user.userId);
  }
  @Get('profile/stats')
  @UseGuards(JwtAuthGuard)
  getProfileStats(@CurrentUser() user: CurrentUserData) {
    return this.usersService.profileStats(user.userId);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @CurrentUser() user: CurrentUserData,
    @Body() updateData: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.userId, updateData);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @CurrentUser() user: CurrentUserData,
    @Body() passwords: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      user.userId,
      passwords.old_password,
      passwords.new_password,
    );
  }

  @Get(':id/follow')
  @UseGuards(JwtAuthGuard)
  async followUser(
    @Param('id', ParseIntPipe) followedId: number,
    @CurrentUser() user: CurrentUserData,
  ) {
    const followerId = user.userId;
    return this.usersService.followUser(followerId, followedId);
  }

  @Get(':id/unfollow')
  @UseGuards(JwtAuthGuard)
  async unfollowUser(
    @Param('id', ParseIntPipe) followedId: number,
    @CurrentUser() user: CurrentUserData,
  ) {
    const followerId = user.userId;
    return this.usersService.unfollowUser(followerId, followedId);
  }

  @Get('count')
  async totalUserCount() {
    return this.usersService.totalUserCount();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async allUsers(
    @Query('search') search: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    const { userId } = user;
    return this.usersService.allUsers(userId, search);
  }

  @Get('profile/:username')
  @UseGuards(JwtAuthGuard)
  async viewProfile(
    @Param('username') username: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    const { userId } = user;
    return this.usersService.viewUser(username, userId);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async search(
    @Query('username') username: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    const { userId } = user;
    return this.usersService.searchByUsername(username, userId);
  }

  @Get(':id/stats')
  async getUserStats(@Param('id', ParseIntPipe) userId: number) {
    return this.usersService.profileStats(userId);
  }

  @Get(':id')
  async viewUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  // @Get('/profile/:username')
  // async viewUserByUsername(@Param('username') username: string) {
  //   return this.usersService.findByUsername(username);
  // }

  @Get(':username/followers')
  async listFollowers(
    @Param('username') username: string,
    @Query('search') search: string,
  ) {
    return this.usersService.getFollowers(username, search);
  }

  @Get(':username/following')
  async listFollowing(
    @Param('username') username: string,
    @Query('search') search: string,
  ) {
    return this.usersService.getFollowing(username, search);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout() {
    return {
      message: 'Logout successful on client side. Please delete your token.',
    };
  }
}
