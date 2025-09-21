import type { Nft } from "../entities/nft.entity"

export class NftTransferredEvent {
  constructor(
    public readonly nft: Nft,
    public readonly fromUserId: string,
    public readonly toUserId: string,
  ) {}
}
