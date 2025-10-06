import { Injectable } from '@nestjs/common';

export type FakeNameTheme = 'default' | 'space' | 'animals' | 'colors' | 'cyber' | 'mythical';

@Injectable()
export class FakeNameGeneratorService {
  private readonly themes = {
    default: {
      adjectives: ['Anonymous', 'Secret', 'Hidden', 'Mysterious', 'Silent', 'Shadow', 'Phantom', 'Ghost'],
      nouns: ['User', 'Person', 'Member', 'Visitor', 'Guest', 'Participant', 'Speaker', 'Voice']
    },
    space: {
      adjectives: ['Cosmic', 'Stellar', 'Nebular', 'Galactic', 'Orbital', 'Solar', 'Lunar', 'Astral'],
      nouns: ['Explorer', 'Voyager', 'Astronaut', 'Pilot', 'Navigator', 'Commander', 'Captain', 'Ranger']
    },
    animals: {
      adjectives: ['Swift', 'Fierce', 'Mighty', 'Clever', 'Wild', 'Noble', 'Brave', 'Cunning'],
      nouns: ['Wolf', 'Eagle', 'Tiger', 'Lion', 'Fox', 'Bear', 'Hawk', 'Panther', 'Raven', 'Shark']
    },
    colors: {
      adjectives: ['Bright', 'Dark', 'Vivid', 'Pale', 'Deep', 'Light', 'Rich', 'Soft'],
      nouns: ['Crimson', 'Azure', 'Emerald', 'Golden', 'Silver', 'Violet', 'Indigo', 'Coral', 'Amber', 'Jade']
    },
    cyber: {
      adjectives: ['Digital', 'Virtual', 'Quantum', 'Binary', 'Neural', 'Cyber', 'Matrix', 'Electric'],
      nouns: ['Ghost', 'Phantom', 'Protocol', 'Cipher', 'Code', 'Algorithm', 'Vector', 'Nexus', 'Node', 'Core']
    },
    mythical: {
      adjectives: ['Ancient', 'Eternal', 'Mystic', 'Divine', 'Legendary', 'Enchanted', 'Sacred', 'Fabled'],
      nouns: ['Dragon', 'Phoenix', 'Griffin', 'Unicorn', 'Sphinx', 'Oracle', 'Titan', 'Valkyrie', 'Sage', 'Mage']
    }
  };

  private usedNames = new Set<string>();

  /**
   * Generate a unique fake name based on the specified theme
   * @param theme - The theme to use for name generation
   * @param roomId - Room ID to ensure uniqueness within room context
   * @returns A unique fake name
   */
  generateFakeName(theme: FakeNameTheme = 'default', roomId?: string): string {
    const themeData = this.themes[theme] || this.themes.default;
    const { adjectives, nouns } = themeData;

    let attempts = 0;
    let fakeName: string;

    do {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const number = Math.floor(Math.random() * 999) + 1;
      
      fakeName = `${adjective}${noun}${number}`;
      attempts++;

      // Prevent infinite loop
      if (attempts > 100) {
        fakeName = `${adjective}${noun}${Date.now()}`;
        break;
      }
    } while (this.usedNames.has(`${roomId}-${fakeName}`));

    // Store the name as used for this room
    if (roomId) {
      this.usedNames.add(`${roomId}-${fakeName}`);
    }

    return fakeName;
  }

  /**
   * Release a fake name when user leaves the room
   * @param fakeName - The fake name to release
   * @param roomId - The room ID
   */
  releaseFakeName(fakeName: string, roomId: string): void {
    this.usedNames.delete(`${roomId}-${fakeName}`);
  }

  /**
   * Get all available themes
   * @returns Array of available theme names
   */
  getAvailableThemes(): FakeNameTheme[] {
    return Object.keys(this.themes) as FakeNameTheme[];
  }

  /**
   * Validate if a theme exists
   * @param theme - Theme to validate
   * @returns True if theme exists
   */
  isValidTheme(theme: string): theme is FakeNameTheme {
    return theme in this.themes;
  }

  /**
   * Clear used names for a specific room (cleanup when room is deleted)
   * @param roomId - Room ID to clear names for
   */
  clearRoomNames(roomId: string): void {
    const keysToDelete = Array.from(this.usedNames).filter(key => key.startsWith(`${roomId}-`));
    keysToDelete.forEach(key => this.usedNames.delete(key));
  }
}