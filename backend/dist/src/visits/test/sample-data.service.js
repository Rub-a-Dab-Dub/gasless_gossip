"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VisitSampleDataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitSampleDataService = void 0;
const common_1 = require("@nestjs/common");
let VisitSampleDataService = VisitSampleDataService_1 = class VisitSampleDataService {
    visitRepository;
    userRepository;
    logger = new common_1.Logger(VisitSampleDataService_1.name);
    constructor(visitRepository, userRepository) {
        this.visitRepository = visitRepository;
        this.userRepository = userRepository;
    }
    async generateSampleVisits(count = 1000) {
        this.logger.log(`Generating ${count} sample visits...`);
        const users = await this.userRepository.find({ take: 50 });
        if (users.length === 0) {
            throw new Error("No users found. Please create users first.");
        }
        const rooms = [
            "lobby",
            "gaming-room",
            "study-hall",
            "music-lounge",
            "art-gallery",
            "tech-talk",
            "book-club",
            "fitness-center",
            "meditation-space",
            "coffee-chat",
        ];
        const visits = [];
        const now = new Date();
        for (let i = 0; i < count; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const room = rooms[Math.floor(Math.random() * rooms.length)];
            const daysAgo = Math.floor(Math.random() * 30);
            const hoursAgo = Math.floor(Math.random() * 24);
            const minutesAgo = Math.floor(Math.random() * 60);
            const visitTime = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000 - minutesAgo * 60 * 1000);
            visits.push({
                roomId: room,
                userId: user.id,
                createdAt: visitTime,
                duration: Math.floor(Math.random() * 3600) + 60,
                ipAddress: this.generateRandomIP(),
                userAgent: this.getRandomUserAgent(),
            });
        }
        const batchSize = 100;
        for (let i = 0; i < visits.length; i += batchSize) {
            const batch = visits.slice(i, i + batchSize);
            await this.visitRepository.save(batch);
            this.logger.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(visits.length / batchSize)}`);
        }
        this.logger.log(`Successfully generated ${count} sample visits`);
    }
    async generateMockUsers(count = 20) {
        this.logger.log(`Generating ${count} mock users...`);
        const users = [];
        const usernames = [
            "alice_wonder",
            "bob_builder",
            "charlie_brown",
            "diana_prince",
            "eve_online",
            "frank_castle",
            "grace_hopper",
            "henry_ford",
            "iris_west",
            "jack_sparrow",
            "kate_bishop",
            "luke_skywalker",
            "mary_jane",
            "nick_fury",
            "olivia_pope",
            "peter_parker",
            "quinn_fabray",
            "rick_sanchez",
            "sarah_connor",
            "tony_stark",
        ];
        for (let i = 0; i < Math.min(count, usernames.length); i++) {
            users.push({
                username: usernames[i],
                email: `${usernames[i]}@example.com`,
                pseudonym: `User${i + 1}`,
                stellarAccountId: this.generateRandomStellarId(),
            });
        }
        await this.userRepository.save(users);
        this.logger.log(`Successfully generated ${users.length} mock users`);
    }
    generateRandomIP() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }
    getRandomUserAgent() {
        const userAgents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
        ];
        return userAgents[Math.floor(Math.random() * userAgents.length)];
    }
    generateRandomStellarId() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let result = "G";
        for (let i = 0; i < 55; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    async clearSampleData() {
        this.logger.log("Clearing sample visit data...");
        await this.visitRepository.clear();
        this.logger.log("Sample visit data cleared");
    }
};
exports.VisitSampleDataService = VisitSampleDataService;
exports.VisitSampleDataService = VisitSampleDataService = VisitSampleDataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Function])
], VisitSampleDataService);
//# sourceMappingURL=sample-data.service.js.map