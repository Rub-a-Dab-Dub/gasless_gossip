import { Injectable } from '@nestjs/common';

@Injectable()
export class BlurredAvatarsService {
  // Temporary in-memory storage for testing
  private blurredAvatars: { userId: string; blurLevel: number; imageUrl: string }[] = [];

  // Create a blurred avatar entry
  create(userId: string, blurLevel: number, imageUrl: string) {
    const newAvatar = { userId, blurLevel, imageUrl };
    this.blurredAvatars.push(newAvatar);
    return newAvatar;
  }

  // Get blurred avatar by userId
  findByUserId(userId: string) {
    return this.blurredAvatars.filter(avatar => avatar.userId === userId);
  }
}
