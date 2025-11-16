import { RentalAmountCalculatorService } from "./rentalAmountCalculator.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Vehicle } from "generated/prisma";

describe("RentalAmountCalculatorService", () => {
  let service: RentalAmountCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentalAmountCalculatorService],
    }).compile();

    service = module.get<RentalAmountCalculatorService>(
      RentalAmountCalculatorService,
    );
  });

  describe("calculateRentAmount", () => {
    const mockVehicle = {
      dailyRate: {
        toNumber: () => 100,
      },
    } as Vehicle;

    it("should calculate rent amount for multiple days", () => {
      const startDate = new Date("2025-01-01");
      const endDate = new Date("2025-01-04");

      const amount = service.calculateRentAmount(
        mockVehicle,
        startDate,
        endDate,
      );

      expect(amount).toBe(300);
    });

    it("should calculate rent amount for single day", () => {
      const startDate = new Date("2025-01-01");
      const endDate = new Date("2025-01-02");

      const amount = service.calculateRentAmount(
        mockVehicle,
        startDate,
        endDate,
      );

      expect(amount).toBe(100);
    });

    it("should calculate rent amount for less than a day", () => {
      const startDate = new Date("2025-01-01T10:00:00");
      const endDate = new Date("2025-01-01T22:00:00");

      const amount = service.calculateRentAmount(
        mockVehicle,
        startDate,
        endDate,
      );

      expect(amount).toBe(50);
    });
  });
});
