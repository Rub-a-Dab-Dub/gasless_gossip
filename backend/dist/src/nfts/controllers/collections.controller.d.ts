import type { User } from "../../users/entities/user.entity";
import type { CreateCollectionDto } from "../dto/create-collection.dto";
import { CollectionResponseDto } from "../dto/collection-response.dto";
export declare class CollectionsController {
    constructor();
    createCollection(user: User, createCollectionDto: CreateCollectionDto): Promise<CollectionResponseDto>;
    getCollections(): Promise<CollectionResponseDto[]>;
    getCollectionById(id: string): Promise<CollectionResponseDto>;
}
