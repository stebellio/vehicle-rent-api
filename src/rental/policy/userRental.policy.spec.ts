import { UserRentalPolicy } from "./userRental.policy";
import { Test, TestingModule } from "@nestjs/testing";
import { User, Rental } from "generated/prisma";
import { UserBusyException } from "../exception/userBusy.exception";

describe("UserRentalPolicy", () => {
  let policy: UserRentalPolicy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRentalPolicy],
    }).compile();

    policy = module.get<UserRentalPolicy>(UserRentalPolicy);
  });

  describe("verifyUserCanRentAVehicle", () => {
    let user: User & { rentals: Rental[] };

    beforeEach(() => {
      user = {
        id: 1,
        name: "test",
        email: "<EMAIL>",
        rentals: [],
      } as User & { rentals: Rental[] };
    });

    it("should throw if user has a pending rental", () => {
      user.rentals.push({ id: 1, completedAt: null } as Rental);
      expect(() => policy.verifyUserCanRentAVehicle(user)).toThrow(
        UserBusyException,
      );
    });

    it("should not throw if user has no rentals", () => {
      user.rentals = [];
      expect(() => policy.verifyUserCanRentAVehicle(user)).not.toThrow();
    });

    it("should not throw if user has only completed rentals", () => {
      user.rentals.push({ id: 1, completedAt: new Date() } as Rental);
      expect(() => policy.verifyUserCanRentAVehicle(user)).not.toThrow();
    });
  });
});
