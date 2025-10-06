import { PartialType } from "@nestjs/mapped-types";
import { CreateGiftDto } from "./create-gift.dto";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateGiftDto extends PartialType(CreateGiftDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
