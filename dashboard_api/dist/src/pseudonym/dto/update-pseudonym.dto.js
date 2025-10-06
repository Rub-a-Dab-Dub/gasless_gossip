"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePseudonymDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_pseudonym_dto_1 = require("./create-pseudonym.dto");
class UpdatePseudonymDto extends (0, swagger_1.PartialType)(create_pseudonym_dto_1.CreatePseudonymDto) {
}
exports.UpdatePseudonymDto = UpdatePseudonymDto;
//# sourceMappingURL=update-pseudonym.dto.js.map