import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { VehicleNotFoundException } from "./exception/vehicleNotFound.exception";
import { Vehicle } from "generated/prisma";

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  async getVehicleWithActiveRental(id: number) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: { rentals: { where: { completedAt: null } } },
    });

    if (!vehicle) {
      throw new VehicleNotFoundException(id);
    }

    return vehicle;
  }
}
