import { Injectable } from '@nestjs/common';

@Injectable()
export class FakeNameGeneratorService {
  private readonly nameThemes = {
    default: {
      adjectives: ['Mysterious', 'Secret', 'Anonymous', 'Hidden', 'Whisper', 'Silent', 'Shadow', 'Phantom'],
      nouns: ['Wanderer', 'Oracle', 'Guardian', 'Spirit', 'Ghost', 'Sage', 'Keeper', 'Watcher']
    },
    space: {
      adjectives: ['Cosmic', 'Nebula', 'Stellar', 'Galaxy', 'Orbit', 'Quantum', 'Celestial', 'Astral'],
      nouns: ['Explorer', 'Navigator', 'Voyager', 'Pilot', 'Commander', 'Ranger', 'Scout', 'Drifter']
    },
    animals: {
      adjectives: ['Shadow', 'Neon', 'Cyber', 'Digital', 'Wild', 'Swift', 'Fierce', 'Cunning'],
      nouns: ['Fox', 'Tiger', 'Wolf', 'Eagle', 'Panther', 'Raven', 'Hawk', 'Lynx']
    },
    colors: {
      adjectives: ['Crimson', 'Azure', 'Golden', 'Silver', 'Violet', 'Emerald', 'Obsidian', 'Pearl'],
      nouns: ['Ghost', 'Phantom', 'Spirit', 'Shade', 'Wraith', 'Specter', 'Vision', 'Dream']
    },
    cyber: {
      adjectives: ['Neon', 'Digital', 'Cyber', 'Virtual', 'Binary', 'Neural', 'Electric', 'Quantum'],
      nouns: ['Agent', 'Hacker', 'Runner', 'Ghost', 'Phantom', 'Virus', 'Code', 'Matrix']
    },
    mythical: {
      adjectives: ['Ancient', 'Mystic', 'Divine', 'Eternal', 'Sacred', 'Enchanted', 'Legendary', 'Mythic'],
      nouns: ['Dragon', 'Phoenix', 'Sphinx', 'Oracle', 'Titan', 'Valkyrie', 'Seraph', 'Keeper']
    }
  };

  /**
   * Generate a fake name based on the specified theme
   */
  generateFakeName(theme: string = 'default'): string {
    const themeData = this.nameThemes[theme] || this.nameThemes.default;
    
    const adjective = this.getRandomElement(themeData.adjectives);
    const noun = this.getRandomElement(themeData.nouns);
    
    return `${adjective} ${noun}`;
  }

  /**
   * Generate multiple unique fake names for a room
   */
  generateMultipleFakeNames(theme: string = 'default', count: number = 10): string[] {
    const names = new Set<string>();
    let attempts = 0;
    const maxAttempts = count * 10; // Prevent infinite loops
    
    while (names.size < count && attempts < maxAttempts) {
      names.add(this.generateFakeName(theme));
      attempts++;
    }
    
    return Array.from(names);
  }

  /**
   * Check if a generated name follows the theme pattern
   */
  validateNameForTheme(name: string, theme: string): boolean {
    const themeData = this.nameThemes[theme] || this.nameThemes.default;
    const parts = name.split(' ');
    
    if (parts.length !== 2) return false;
    
    return themeData.adjectives.includes(parts[0]) && 
           themeData.nouns.includes(parts[1]);
  }

  /**
   * Get all available themes
   */
  getAvailableThemes(): string[] {
    return Object.keys(this.nameThemes);
  }

  /**
   * Get theme preview - shows example names for a theme
   */
  getThemePreview(theme: string, count: number = 3): string[] {
    return this.generateMultipleFakeNames(theme, count);
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}