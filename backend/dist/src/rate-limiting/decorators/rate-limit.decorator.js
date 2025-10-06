"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRateLimit = exports.CommentRateLimit = exports.VoteRateLimit = exports.GossipRateLimit = exports.LenientRateLimit = exports.ModerateRateLimit = exports.StrictRateLimit = exports.RateLimit = exports.RATE_LIMIT_KEY = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
exports.RATE_LIMIT_KEY = 'rate_limit';
const RateLimit = (options) => {
    return (target, propertyKey, descriptor) => {
        const throttleDecorator = (0, throttler_1.Throttle)({
            [options.keyGenerator ? 'custom' : 'short']: {
                limit: options.limit,
                ttl: options.ttl / 1000,
            },
        });
        if (descriptor) {
            throttleDecorator(target, propertyKey, descriptor);
        }
        (0, common_1.SetMetadata)(exports.RATE_LIMIT_KEY, options)(target, propertyKey, descriptor);
    };
};
exports.RateLimit = RateLimit;
const StrictRateLimit = (limit, ttl = 60000) => (0, exports.RateLimit)({ limit, ttl });
exports.StrictRateLimit = StrictRateLimit;
const ModerateRateLimit = (limit, ttl = 300000) => (0, exports.RateLimit)({ limit, ttl });
exports.ModerateRateLimit = ModerateRateLimit;
const LenientRateLimit = (limit, ttl = 3600000) => (0, exports.RateLimit)({ limit, ttl });
exports.LenientRateLimit = LenientRateLimit;
const GossipRateLimit = () => (0, exports.RateLimit)({ limit: 10, ttl: 60000 });
exports.GossipRateLimit = GossipRateLimit;
const VoteRateLimit = () => (0, exports.RateLimit)({ limit: 20, ttl: 60000 });
exports.VoteRateLimit = VoteRateLimit;
const CommentRateLimit = () => (0, exports.RateLimit)({ limit: 15, ttl: 60000 });
exports.CommentRateLimit = CommentRateLimit;
const AdminRateLimit = () => (0, exports.RateLimit)({ limit: 5, ttl: 60000 });
exports.AdminRateLimit = AdminRateLimit;
//# sourceMappingURL=rate-limit.decorator.js.map