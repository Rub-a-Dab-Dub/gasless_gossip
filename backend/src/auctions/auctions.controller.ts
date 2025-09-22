import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { StartAuctionDto } from './dto/start-auction.dto';
import { PlaceBidDto } from './dto/place-bid.dto';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post('start')
  async startAuction(@Body() startAuctionDto: StartAuctionDto) {
    try {
      const auction = await this.auctionsService.startAuction(startAuctionDto);
      return {
        success: true,
        data: auction,
        message: 'Auction started successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error instanceof Error ? error.message : 'An error occurred',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('bid')
  async placeBid(@Body() placeBidDto: PlaceBidDto) {
    try {
      const bid = await this.auctionsService.placeBid(placeBidDto);
      return {
        success: true,
        data: bid,
        message: 'Bid placed successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error instanceof Error ? error.message : 'An error occurred',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async getAuctionStatus(@Param('id') id: string) {
    try {
      const auction = await this.auctionsService.getAuctionById(id);
      return {
        success: true,
        data: auction,
        message: 'Auction retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error instanceof Error ? error.message : 'An error occurred',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get()
  async getActiveAuctions() {
    try {
      const auctions = await this.auctionsService.getActiveAuctions();
      return {
        success: true,
        data: auctions,
        message: 'Active auctions retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        { success: false, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
