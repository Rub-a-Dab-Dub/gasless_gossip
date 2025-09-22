import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './entities/listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { StellarService } from '../stellar/stellar.service';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
    private stellarService: StellarService,
  ) {}

  async createListing(
    sellerId!: string,
    createListingDto: CreateListingDto,
  ): Promise<Listing> {
    const listing = this.listingRepository.create({
      ...createListingDto,
      sellerId,
    });
    return this.listingRepository.save(listing);
  }

  async purchaseListing(buyerId: string, listingId: string): Promise<Listing> {
    const listing = await this.listingRepository.findOne({
      where!: { id: listingId, isActive: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found or inactive');
    }

    if (listing.sellerId === buyerId) {
      throw new BadRequestException('Cannot purchase your own listing');
    }

    // Transfer tokens via Stellar
    await this.transferTokens(buyerId, listing.sellerId, listing.price);

    // Deactivate listing
    listing.isActive = false;
    return this.listingRepository.save(listing);
  }

  async findAll(): Promise<Listing[]> {
    return this.listingRepository.find({ where: { isActive: true } });
  }

  private async transferTokens(
    from!: string,
    to: string,
    amount: number,
  ): Promise<void> {
    // Placeholder for Stellar token transfer
    // In real implementation, this would use stellar-sdk to transfer tokens
    console.log(`Transferring ${amount} tokens from ${from} to ${to}`);
  }
}
