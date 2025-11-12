import { IsInt, IsDateString, Min, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateRentalDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsInt()
  @Min(1)
  vehicleId: number;

  @IsInt()
  @Min(1)
  startSiteId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
