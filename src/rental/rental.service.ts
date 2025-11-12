import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User, Vehicle, Rental } from "generated/prisma";

@Injectable()
export class RentalService {
  constructor(private readonly prisma: PrismaService) {}

  async createRental(
    user: User,
    vehicle: Vehicle,
    startSiteId: number,
    startDate?: Date,
  ): Promise<Rental> {
    const rental = await this.prisma.rental.create({
      data: {
        userId: user.id,
        vehicleId: vehicle.id,
        startSiteId,
        startDate: startDate ?? new Date(),
      },
    });

    return rental;
  }
}
