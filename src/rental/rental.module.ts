import { Module } from "@nestjs/common";
import { RentalController } from "./rental.controller";
import { RentalService } from "./rental.service";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "../user/user.module";
import { VehicleModule } from "../vehicle/vehicle.module";
import { VehicleRentalPolicy } from "./policy/vehicleRental.policy";
import { UserRentalPolicy } from "./policy/userRental.policy";
import { RentalAmountCalculatorService } from "./rentalAmountCalculator.service";
import { NotificationModule } from "../notification/notification.module";

@Module({
  controllers: [RentalController],
  providers: [
    RentalService,
    VehicleRentalPolicy,
    UserRentalPolicy,
    RentalAmountCalculatorService,
  ],
  imports: [PrismaModule, UserModule, VehicleModule, NotificationModule],
})
export class RentalModule {}
