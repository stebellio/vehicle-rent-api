import { Module } from "@nestjs/common";
import { RentalController } from "./rental.controller";
import { RentalService } from "./rental.service";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "../user/user.module";
import { VehicleModule } from "../vehicle/vehicle.module";
import { VehicleRentalPolicy } from "./policy/vehicleRental.policy";
import { UserRentalPolicy } from "./policy/userRental.policy";
import { RentalAmountCalculatorService } from "./rentalAmountCalculator.service";

@Module({
  controllers: [RentalController],
  providers: [
    RentalService,
    VehicleRentalPolicy,
    UserRentalPolicy,
    RentalAmountCalculatorService,
  ],
  imports: [PrismaModule, UserModule, VehicleModule],
})
export class RentalModule {}
