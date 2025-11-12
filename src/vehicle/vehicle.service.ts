import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehicleNotFoundException } from './exception/vehicleNotFound.exception';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  async getVehicle(id: number) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new VehicleNotFoundException(id);
    }

    return vehicle;
  }
}
