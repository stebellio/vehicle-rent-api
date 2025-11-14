import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Rental, Site, User, Vehicle } from "generated/prisma";
import { UserService } from "../user/user.service";
import { VehicleService } from "../vehicle/vehicle.service";
import { VehicleRentalPolicy } from "./policy/vehicleRental.policy";
import { UserRentalPolicy } from "./policy/userRental.policy";
import { RentalAmountCalculatorService } from "./rentalAmountCalculator.service";
import { NotificationService } from "../notification/notification.service";
import { RentalNotFoundException } from "./exception/rentalNotFound.exception";
import { RentalUserNotFoundException } from "./exception/rentalUserNotFound.exception";
import { RentalVehicleNotFoundException } from "./exception/rentalVehicleNotFound.exception";
import { RentalPolicy } from "./policy/rental.policy";
import { SiteService } from "../site/site.service";

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
    private readonly rentalPolicy: RentalPolicy,
    private readonly siteService: SiteService,
  ) {}

  async createRental(
    userId: number,
    vehicleId: number,
    startSiteId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Rental> {
    const [user, vehicle, site] = await Promise.all([
      this.userService.getUserWithActiveRental(userId),
      this.vehicleService.getVehicleWithActiveRental(vehicleId),
      this.siteService.getSiteById(startSiteId),
    ]);

    this.userRentalPolicy.verifyUserCanRentAVehicle(user);
    this.vehicleRentalPolicy.verifyVehicleCanBeRented(vehicle, site.id);

    const amount = this.rentalAmountCalculatorService.calculateRentAmount(
      vehicle,
      startDate,
      endDate,
    );

    const rental = await this.prisma.rental.create({
      data: {
        userId: userId,
        vehicleId: vehicle.id,
        startSiteId: site.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        amount,
      },
    });

    await this.notifyRentalConfirm(rental, user, vehicle, site);

    return rental;
  }

  async completeRental(
    id: number,
    date: Date,
    endSiteId: number,
  ): Promise<void> {
    const [rental, site] = await Promise.all([
      this.getRentalWithUserAndVehicle(id),
      this.siteService.getSiteById(endSiteId),
    ]);

    const user: User = rental.user;
    const vehicle: Vehicle = rental.vehicle;

    this.rentalPolicy.verifyCanCompleteRental(rental, date);

    await this.prisma.$transaction([
      this.prisma.vehicle.update({
        where: { id: rental.vehicle.id },
        data: { currentSiteId: endSiteId },
      }),
      this.prisma.rental.update({
        where: { id: rental.id },
        data: {
          completedAt: date,
          endSiteId,
        },
      }),
    ]);

    await this.notifyRentalComplete(rental, user, vehicle, site);
  }

  private async getRentalWithUserAndVehicle(
    id: number,
  ): Promise<Rental & { user: User } & { vehicle: Vehicle }> {
    const rental = await this.prisma.rental.findUnique({
      where: { id },
      include: { user: true, vehicle: true },
    });

    if (!rental) {
      throw new RentalNotFoundException();
    }

    if (!rental.user) {
      throw new RentalUserNotFoundException();
    }

    if (!rental.vehicle) {
      throw new RentalVehicleNotFoundException();
    }

    return rental;
  }

  private async notifyRentalConfirm(
    rental: Rental,
    user: User,
    vehicle: Vehicle,
    site: Site,
  ) {
    try {
      await this.notificationService.sendRentalConfirmNotification(
        user,
        vehicle,
        rental,
        site,
      );
    } catch {
      // do nothing
    }
  }

  private async notifyRentalComplete(
    rental: Rental,
    user: User,
    vehicle: Vehicle,
    site: Site,
  ) {
    try {
      await this.notificationService.sendRentalCompleteNotification(
        user,
        vehicle,
        rental,
        site,
      );
    } catch {
      // do nothing
    }
  }
}
