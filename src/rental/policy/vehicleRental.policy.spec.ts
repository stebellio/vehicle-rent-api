import { VehicleRentalPolicy } from "./vehicleRental.policy";
import { Test, TestingModule } from "@nestjs/testing";
import { Vehicle, Rental } from "generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { VehicleBusyException } from "../exception/vehicleBusy.exception";
import { VehicleWrongSiteException } from "../exception/vehicleWrongSite.exception";

describe("VehicleRentalPolicy", () => {
  let policy: VehicleRentalPolicy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleRentalPolicy],
    }).compile();

    policy = module.get<VehicleRentalPolicy>(VehicleRentalPolicy);
  });

  describe("verifyVehicleCanBeRented", () => {
    let vehicle: Vehicle & { rentals: Rental[] };

    beforeEach(() => {
      vehicle = {
        id: 1,
        name: "test",
        vehicleTypeId: 1,
        currentSiteId: 1,
        dailyRate: new Decimal("100.00"),
        rentals: [],
      } as Vehicle & { rentals: Rental[] };
    });

    it("should throw if vehicle has a pending rental", () => {
      vehicle.rentals.push({ id: 1, completedAt: null } as Rental);
      expect(() => policy.verifyVehicleCanBeRented(vehicle, 1)).toThrow(
        VehicleBusyException,
      );
    });

    it("should not throw if vehicle has no rentals", () => {
      vehicle.rentals = [];
      expect(() => policy.verifyVehicleCanBeRented(vehicle, 1)).not.toThrow();
    });

    it("should not throw if vehicle has only completed rentals", () => {
      vehicle.rentals.push({ id: 1, completedAt: new Date() } as Rental);
      expect(() => policy.verifyVehicleCanBeRented(vehicle, 1)).not.toThrow();
    });

    it("should throw if vehicle is in a different site", () => {
      vehicle.currentSiteId = 1;
      expect(() => policy.verifyVehicleCanBeRented(vehicle, 2)).toThrow(
        VehicleWrongSiteException,
      );
    });
  });
});
