import { PartialType } from "@nestjs/swagger"
import { CreateDauMetricDto } from "./create-dau-metric.dto"

export class UpdateDauMetricDto extends PartialType(CreateDauMetricDto) {}
