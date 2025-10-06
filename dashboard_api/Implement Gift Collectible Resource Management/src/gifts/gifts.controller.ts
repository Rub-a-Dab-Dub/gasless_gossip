import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { GiftsService } from "./gifts.service";
import { CreateGiftDto } from "./dto/create-gift.dto";
import { UpdateGiftDto } from "./dto/update-gift.dto";
import { AssignGiftDto } from "./dto/assign-gift.dto";
import { GiftUserDto } from "./dto/gift-user.dto";
import { BattleRewardDto } from "./dto/battle-reward.dto";

// @UseGuards(JwtAuthGuard, RolesGuard) - Uncomment in production
@Controller("gifts")
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  // ========== CREATE (Mint) ==========
  @Post("mint")
  // @Roles('admin') - Uncomment in production
  mint(@Body() createGiftDto: CreateGiftDto) {
    return this.giftsService.mintGift(createGiftDto);
  }

  // ========== READ ==========
  @Get()
  findAll(
    @Query("type") type?: string,
    @Query("rarity") rarity?: string,
    @Query("isActive") isActive?: string
  ) {
    return this.giftsService.findAll({
      type,
      rarity,
      isActive: isActive === "true",
    });
  }

  @Get("low-stock")
  // @Roles('admin') - Uncomment in production
  getLowStockAlerts() {
    return this.giftsService.checkLowStockAlerts();
  }

  @Get("patterns")
  // @Roles('admin') - Uncomment in production
  getGiftingPatterns(@Query("giftId") giftId?: string) {
    return this.giftsService.getGiftingPatterns(giftId);
  }

  @Get("inventory/:userId")
  getUserInventory(@Param("userId") userId: string) {
    return this.giftsService.getUserInventory(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.giftsService.findOne(id);
  }

  // ========== UPDATE ==========
  @Patch(":id")
  // @Roles('admin') - Uncomment in production
  update(@Param("id") id: string, @Body() updateGiftDto: UpdateGiftDto) {
    return this.giftsService.update(id, updateGiftDto);
  }

  @Post("assign")
  // @Roles('admin') - Uncomment in production
  assign(
    @Body() assignDto: AssignGiftDto
    // @CurrentUser() user: User - Uncomment in production
  ) {
    const adminId = "temp-admin-id"; // Replace with user.id in production
    return this.giftsService.assignGift(assignDto, adminId);
  }

  @Post("revoke")
  @HttpCode(HttpStatus.NO_CONTENT)
  // @Roles('admin') - Uncomment in production
  revoke(
    @Body() body: { userId: string; giftId: string; quantity: number }
    // @CurrentUser() user: User - Uncomment in production
  ) {
    const adminId = "temp-admin-id"; // Replace with user.id in production
    return this.giftsService.revokeGift(
      body.userId,
      body.giftId,
      body.quantity,
      adminId
    );
  }

  @Post("gift")
  @HttpCode(HttpStatus.NO_CONTENT)
  giftToUser(@Body() giftDto: GiftUserDto) {
    return this.giftsService.giftToUser(giftDto);
  }

  @Post("battle-reward")
  battleReward(@Body() battleDto: BattleRewardDto) {
    return this.giftsService.autoAwardBattleWinner(battleDto);
  }

  // ========== DELETE (Burn) ==========
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  // @Roles('admin') - Uncomment in production
  burn(@Param("id") id: string) {
    return this.giftsService.burnGift(id);
  }
}
