import { Repository } from 'typeorm';
import { Listing } from './entities/listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { StellarService } from '../stellar/stellar.service';
export declare class MarketplaceService {
    private listingRepository;
    private stellarService;
    constructor(listingRepository: Repository<Listing>, stellarService: StellarService);
    createListing(sellerId: string, createListingDto: CreateListingDto): Promise<Listing>;
    purchaseListing(buyerId: string, listingId: string): Promise<Listing>;
    findAll(): Promise<Listing[]>;
    private transferTokens;
}
