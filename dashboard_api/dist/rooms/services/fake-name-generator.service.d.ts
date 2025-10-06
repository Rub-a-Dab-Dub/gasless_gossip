export type FakeNameTheme = 'default' | 'space' | 'animals' | 'colors' | 'cyber' | 'mythical';
export declare class FakeNameGeneratorService {
    private readonly themes;
    private usedNames;
    generateFakeName(theme?: FakeNameTheme, roomId?: string): string;
    releaseFakeName(fakeName: string, roomId: string): void;
    getAvailableThemes(): FakeNameTheme[];
    isValidTheme(theme: string): theme is FakeNameTheme;
    clearRoomNames(roomId: string): void;
}
