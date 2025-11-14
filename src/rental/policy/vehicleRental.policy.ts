import { Injectable } from "@nestjs/common";
import { Rental, Vehicle } from "generated/prisma";
import { VehicleBusyException } from "../exception/vehicleBusy.exception";
import { VehicleWrongSiteException } from "../exception/vehicleWrongSite.exception";

@Injectable()
export class VehicleRentalPolicy {
  verifyVehicleCanBeRented(
    vehicle: Vehicle & { rentals: Rental[] },
    startSiteId: number,
  ) {
    this.verifyVehicleIsAvailable(vehicle);
    this.verifyVehicleIsInSite(vehicle, startSiteId);
  }

  private verifyVehicleIsInSite(vehicle: Vehicle, siteId: number) {
    if (vehicle.currentSiteId !== siteId) {
      throw new VehicleWrongSiteException();
    }
  }

  private verifyVehicleIsAvailable(vehicle: Vehicle & { rentals: Rental[] }) {
    const isBusy = vehicle.rentals.find(
      (rental) => rental.completedAt === null,
    );

    if (isBusy) {
      throw new VehicleBusyException();
    }
  }
}
