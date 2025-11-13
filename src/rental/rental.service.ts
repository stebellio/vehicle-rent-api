import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Rental, User, Vehicle } from "generated/prisma";
import { UserService } from "../user/user.service";
import { VehicleService } from "../vehicle/vehicle.service";
import { VehicleRentalPolicy } from "./policy/vehicleRental.policy";
import { UserRentalPolicy } from "./policy/userRental.policy";
import { RentalAmountCalculatorService } from "./rentalAmountCalculator.service";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class RentalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly vehicleService: VehicleService,
    private readonly vehicleRentalPolicy: VehicleRentalPolicy,
    private readonly userRentalPolicy: UserRentalPolicy,
    private readonly rentalAmountCalculatorService: RentalAmountCalculatorService,
    private readonly notificationService: NotificationService,
  ) {}

  async createRental(
    userId: number,
    vehicleId: number,
    startSiteId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Rental> {
    const [user, vehicle] = await Promise.all([
      this.userService.getUserWithActiveRental(userId),
      this.vehicleService.getVehicleWithActiveRental(vehicleId),
    ]);

    this.userRentalPolicy.verifyUserCanRentAVehicle(user);
    this.vehicleRentalPolicy.verifyCanRentVehicle(vehicle, startSiteId);

    const amount = this.rentalAmountCalculatorService.calculateRentAmount(
      vehicle,
      startDate,
      endDate,
    );

    const rental = await this.prisma.rental.create({
      data: {
        userId: userId,
        vehicleId: vehicle.id,
        startSiteId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        amount,
      },
    });

    await this.notifyRentalConfirm(rental, user, vehicle);

    return rental;
  }

  async notifyRentalConfirm(rental: Rental, user: User, vehicle: Vehicle) {
    try {
      await this.notificationService.sendRentalConfirmNotification(
        user,
        vehicle,
        rental,
      );
    } catch (e) {
      Logger.error("RentalService", "notifyRentalConfirm", e);
    }
  }
}
