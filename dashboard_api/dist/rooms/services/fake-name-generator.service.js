"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeNameGeneratorService = void 0;
const common_1 = require("@nestjs/common");
let FakeNameGeneratorService = class FakeNameGeneratorService {
    themes = {
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
    usedNames = new Set();
    generateFakeName(theme = 'default', roomId) {
        const themeData = this.themes[theme] || this.themes.default;
        const { adjectives, nouns } = themeData;
        let attempts = 0;
        let fakeName;
        do {
            const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const noun = nouns[Math.floor(Math.random() * nouns.length)];
            const number = Math.floor(Math.random() * 999) + 1;
            fakeName = `${adjective}${noun}${number}`;
            attempts++;
            if (attempts > 100) {
                fakeName = `${adjective}${noun}${Date.now()}`;
                break;
            }
        } while (this.usedNames.has(`${roomId}-${fakeName}`));
        if (roomId) {
            this.usedNames.add(`${roomId}-${fakeName}`);
        }
        return fakeName;
    }
    releaseFakeName(fakeName, roomId) {
        this.usedNames.delete(`${roomId}-${fakeName}`);
    }
    getAvailableThemes() {
        return Object.keys(this.themes);
    }
    isValidTheme(theme) {
        return theme in this.themes;
    }
    clearRoomNames(roomId) {
        const keysToDelete = Array.from(this.usedNames).filter(key => key.startsWith(`${roomId}-`));
        keysToDelete.forEach(key => this.usedNames.delete(key));
    }
};
exports.FakeNameGeneratorService = FakeNameGeneratorService;
exports.FakeNameGeneratorService = FakeNameGeneratorService = __decorate([
    (0, common_1.Injectable)()
], FakeNameGeneratorService);
//# sourceMappingURL=fake-name-generator.service.js.map