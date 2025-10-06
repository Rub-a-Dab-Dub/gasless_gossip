import { StellarEventDto } from '../dto/hook.dto';
export declare class MockEventGenerator {
    static generateXpUpdateEvent(): StellarEventDto;
    static generateTokenSendEvent(): StellarEventDto;
    static generateTokenReceiveEvent(): StellarEventDto;
    static generateContractCallEvent(): StellarEventDto;
    static generateAccountCreatedEvent(): StellarEventDto;
    static generateRandomEvent(): StellarEventDto;
    static generateBatchEvents(count: number): StellarEventDto[];
}
