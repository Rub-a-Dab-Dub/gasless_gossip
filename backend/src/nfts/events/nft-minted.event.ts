import type { Nft } from "../entities/nft.entity"

export class NftMintedEvent {
  constructor(public readonly nft: Nft) {}
}
