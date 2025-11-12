import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Rental } from "generated/prisma";
import { UserService } from "../user/user.service";
import { VehicleService } from "../vehicle/vehicle.service";
import { VehicleRentalPolicy } from "./policy/vehicleRental.policy";
import { UserRentalPolicy } from "./policy/userRental.policy";

@Injectable()
export class RentalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly vehicleService: VehicleService,
    private readonly vehicleRentalPolicy: VehicleRentalPolicy,
    private readonly userRentalPolicy: UserRentalPolicy,
  ) {}

  async createRental(
    userId: number,
    vehicleId: number,
    startSiteId: number,
    startDate?: Date,
  ): Promise<Rental> {
    const [user, vehicle] = await Promise.all([
      this.userService.getUserWithActiveRental(userId),
      this.vehicleService.getVehicleWithActiveRental(vehicleId),
    ]);

    this.userRentalPolicy.verifyUserCanRentAVehicle(user);
    this.vehicleRentalPolicy.verifyCanRentVehicle(vehicle, startSiteId);

    return this.prisma.rental.create({
      data: {
        userId: userId,
        vehicleId: vehicle.id,
        startSiteId,
        startDate: startDate ?? new Date(),
      },
    });
  }
}
