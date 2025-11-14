import { IsInt, IsDateString, Min } from "class-validator";

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
