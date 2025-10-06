import type { TransferLoggerService } from "../services/transfer-logger.service";
import type { NftMintedEvent } from "../events/nft-minted.event";
import type { NftTransferredEvent } from "../events/nft-transferred.event";
export declare class TransferLoggerListener {
    private transferLoggerService;
    private readonly logger;
    constructor(transferLoggerService: TransferLoggerService);
    handleNftMinted(event: NftMintedEvent): Promise<void>;
    handleNftTransferred(event: NftTransferredEvent): Promise<void>;
    handleTransferLogged(event: {
        nftId: string;
        transferHistory: any;
    }): Promise<void>;
}
