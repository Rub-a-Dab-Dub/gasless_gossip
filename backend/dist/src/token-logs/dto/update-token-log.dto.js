"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTokenLogDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_token_log_dto_1 = require("./create-token-log.dto");
class UpdateTokenLogDto extends (0, mapped_types_1.PartialType)(create_token_log_dto_1.CreateTokenLogDto) {
}
exports.UpdateTokenLogDto = UpdateTokenLogDto;
//# sourceMappingURL=update-token-log.dto.js.map