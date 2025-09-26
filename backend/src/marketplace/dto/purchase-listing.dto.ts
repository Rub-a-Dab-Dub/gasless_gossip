import { IsString } from 'class-validator';

export class PurchaseListingDto {
  @IsString()
  listingId!: string;
}
