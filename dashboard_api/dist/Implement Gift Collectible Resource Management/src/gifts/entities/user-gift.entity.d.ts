import { Gift } from "./gift.entity";
export declare class UserGift {
    id: string;
    userId: string;
    giftId: string;
    gift: Gift;
    quantity: number;
    isEquipped: boolean;
    acquiredFrom: string;
    giftedByUserId: string;
    battleId: string;
    acquiredAt: Date;
}
