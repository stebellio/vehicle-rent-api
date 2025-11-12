import { IsInt, IsDateString, Min, IsOptional } from 'class-validator';

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

  @IsOptional()
  @IsDateString()
  startDate?: Date;
}
