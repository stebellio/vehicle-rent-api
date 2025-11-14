import { IsDateString, IsInt } from "class-validator";

export class CompleteRentalDto {
  @IsDateString()
  date: string;

  @IsInt()
  endSiteId: number;
}
