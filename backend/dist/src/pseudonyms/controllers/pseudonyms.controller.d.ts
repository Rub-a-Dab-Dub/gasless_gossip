import { PseudonymsService } from '../services/pseudonyms.service';
import { SetPseudonymDto } from '../dto/set-pseudonym.dto';
import { GetRoomPseudonymsParamsDto } from '../dto/get-room-pseudonyms.dto';
export declare class PseudonymsController {
    private readonly service;
    constructor(service: PseudonymsService);
    set(body: SetPseudonymDto): Promise<{
        id: string;
        roomId: string;
        userId: string;
        pseudonym: string;
    }>;
    list(params: GetRoomPseudonymsParamsDto): Promise<{
        id: string;
        roomId: string;
        userId: string;
        pseudonym: string;
    }[]>;
}
