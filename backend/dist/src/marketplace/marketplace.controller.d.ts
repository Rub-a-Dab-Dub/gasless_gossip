import { MarketplaceService } from './marketplace.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { PurchaseListingDto } from './dto/purchase-listing.dto';
export declare class MarketplaceController {
    private readonly marketplaceService;
    constructor(marketplaceService: MarketplaceService);
    createListing(req: any, createListingDto: CreateListingDto): Promise<import("./entities/listing.entity").Listing>;
    purchaseListing(req: any, purchaseListingDto: PurchaseListingDto): Promise<import("./entities/listing.entity").Listing>;
    findAll(): Promise<import("./entities/listing.entity").Listing[]>;
}
