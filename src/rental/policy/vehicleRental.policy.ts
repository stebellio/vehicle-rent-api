import { Injectable } from "@nestjs/common";
import { Rental, User, Vehicle } from "generated/prisma";
import { VehicleBusyException } from "../exception/vehicleBusy.exception";
import { VehicleWrongSiteException } from "../exception/vehicleWrongSite.exception";

@Injectable()
export class VehicleRentalPolicy {
  verifyCanRentVehicle(
    vehicle: Vehicle & { rentals: Rental[] },
    startSiteId: number,
  ) {
    this.verifyVehicleIsAvailable(vehicle);
    this.verifyVehicleIsInSite(vehicle, startSiteId);
  }

  private verifyVehicleIsInSite(vehicle: Vehicle, siteId: number) {
    if (vehicle.currentSiteId !== siteId) {
      throw new VehicleWrongSiteException(vehicle.id);
    }
  }

  private verifyVehicleIsAvailable(vehicle: Vehicle & { rentals: Rental[] }) {
    const isBusy = vehicle.rentals.find((rental) => rental.endDate === null);

    if (isBusy) {
      throw new VehicleBusyException(vehicle.id);
    }
  }
}
