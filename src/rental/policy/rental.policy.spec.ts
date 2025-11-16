import { RentalPolicy } from "./rental.policy";
import { Test, TestingModule } from "@nestjs/testing";
import { Rental } from "generated/prisma";
import { RentalAlreadyCompletedException } from "../exception/rentalAlreadyCompleted.exception";
import { InvalidRentalCompleteDateException } from "../exception/invalidRentalCompleteDate.exception";

describe("RentalPolicy", () => {
  let policy: RentalPolicy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentalPolicy],
    }).compile();

    policy = module.get<RentalPolicy>(RentalPolicy);
  });

  describe("verifyCanCompleteRental", () => {
    it("should throw if rental is pending", () => {
      const rental: Rental = {
        id: 1,
        completedAt: new Date(),
      } as Rental;

      expect(() => policy.verifyCanCompleteRental(rental, new Date())).toThrow(
        RentalAlreadyCompletedException,
      );
    });

    it("should throw if rental is in future", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const rental: Rental = {
        id: 1,
        startDate: futureDate,
      } as Rental;

      expect(() => policy.verifyCanCompleteRental(rental, new Date())).toThrow(
        InvalidRentalCompleteDateException,
      );
    });

    it("should verify rental can be completed", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);

      const rental: Rental = {
        id: 1,
        startDate,
      } as Rental;

      expect(() =>
        policy.verifyCanCompleteRental(rental, new Date()),
      ).not.toThrow();
    });
  });
});
