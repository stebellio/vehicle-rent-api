import { Test, TestingModule } from "@nestjs/testing";
import { VehicleService } from "./vehicle.service";
import { PrismaService } from "../prisma/prisma.service";
import Mocked = jest.Mocked;
import { Vehicle } from "generated/prisma";
import { VehicleNotFoundException } from "./exception/vehicleNotFound.exception";

describe("VehicleService", () => {
  let service: VehicleService;

  let prismaService: {
    vehicle: Mocked<PrismaService["vehicle"]>;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: PrismaService,
          useValue: {
            vehicle: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    prismaService = module.get(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getVehicleWithActiveRental", () => {
    it("should throw if vehicle is not found", () => {
      prismaService.vehicle.findUnique.mockResolvedValue(null);
      expect(service.getVehicleWithActiveRental(1)).rejects.toThrow(
        VehicleNotFoundException,
      );
    });

    it("should retrieve vehicle", () => {
      const vehicle = { id: 1 } as Vehicle;
      prismaService.vehicle.findUnique.mockResolvedValue(vehicle);
      expect(service.getVehicleWithActiveRental(1)).resolves.toEqual(vehicle);
    });
  });
});
