import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { PurchaseListingDto } from './dto/purchase-listing.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('marketplace')
@UseGuards(AuthGuard)
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('list')
  createListing(
    @Request() req: any,
    @Body() createListingDto: CreateListingDto,
  ) {
    return this.marketplaceService.createListing(
      req.user.sub,
      createListingDto,
    );
  }

  @Post('buy')
  purchaseListing(
    @Request() req: any,
    @Body() purchaseListingDto: PurchaseListingDto,
  ) {
    return this.marketplaceService.purchaseListing(
      req.user.sub,
      purchaseListingDto.listingId,
    );
  }

  @Get()
  findAll() {
    return this.marketplaceService.findAll();
  }
}
