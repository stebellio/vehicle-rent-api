import { Vehicle } from "generated/prisma";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RentalAmountCalculatorService {
  calculateRentAmount(
    vehicle: Vehicle,
    startDate: Date,
    endDate: Date,
  ): number {
    const timeDifference = endDate.getTime() - startDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return daysDifference * vehicle.dailyRate.toNumber();
  }
}
