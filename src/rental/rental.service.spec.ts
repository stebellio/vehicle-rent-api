import { Test, TestingModule } from "@nestjs/testing";
import { RentalService } from "./rental.service";
import Mocked = jest.Mocked;
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../user/user.service";
import { mock } from "jest-mock-extended";
import { VehicleService } from "../vehicle/vehicle.service";
import { VehicleRentalPolicy } from "./policy/vehicleRental.policy";
import { UserRentalPolicy } from "./policy/userRental.policy";
import { RentalAmountCalculatorService } from "./rentalAmountCalculator.service";
import { NotificationService } from "../notification/notification.service";
import { RentalPolicy } from "./policy/rental.policy";
import { SiteService } from "../site/site.service";
import { User, Vehicle, Rental, Site } from "generated/prisma";
import { RentalNotFoundException } from "./exception/rentalNotFound.exception";
import { RentalUserNotFoundException } from "./exception/rentalUserNotFound.exception";
import { RentalVehicleNotFoundException } from "./exception/rentalVehicleNotFound.exception";
import e from "express";

describe("RentalService", () => {
  let service: RentalService;

  let prismaService: {
    rental: Mocked<PrismaService["rental"]>;
    vehicle: Mocked<PrismaService["vehicle"]>;
    $transaction: jest.Mock;
  };
  let userService: Mocked<UserService>;
  let vehicleService: Mocked<VehicleService>;
  let vehicleRentalPolicy: Mocked<VehicleRentalPolicy>;
  let userRentalPolicy: Mocked<UserRentalPolicy>;
  let rentalAmountCalculatorService: Mocked<RentalAmountCalculatorService>;
  let notificationService: Mocked<NotificationService>;
  let rentalPolicy: Mocked<RentalPolicy>;
  let siteService: Mocked<SiteService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalService,
        {
          provide: PrismaService,
          useValue: {
            rental: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            vehicle: {
              update: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: mock<UserService>(),
        },
        {
          provide: VehicleService,
          useValue: mock<VehicleService>(),
        },
        {
          provide: VehicleRentalPolicy,
          useValue: mock<VehicleRentalPolicy>(),
        },
        {
          provide: UserRentalPolicy,
          useValue: mock<UserRentalPolicy>(),
        },
        {
          provide: RentalAmountCalculatorService,
          useValue: mock<RentalAmountCalculatorService>(),
        },
        {
          provide: NotificationService,
          useValue: mock<NotificationService>(),
        },
        {
          provide: RentalPolicy,
          useValue: mock<RentalPolicy>(),
        },
        {
          provide: SiteService,
          useValue: mock<SiteService>(),
        },
      ],
    }).compile();

    service = module.get<RentalService>(RentalService);
    prismaService = module.get(PrismaService);
    userService = module.get(UserService);
    vehicleService = module.get(VehicleService);
    vehicleRentalPolicy = module.get(VehicleRentalPolicy);
    userRentalPolicy = module.get(UserRentalPolicy);
    rentalAmountCalculatorService = module.get(RentalAmountCalculatorService);
    notificationService = module.get(NotificationService);
    rentalPolicy = module.get(RentalPolicy);
    siteService = module.get(SiteService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createRental", () => {
    let user: User & { rentals: Rental[] };
    let vehicle: Vehicle & { rentals: Rental[] };
    let site: Site;

    beforeEach(() => {
      user = { id: 1 } as User & { rentals: Rental[] };
      vehicle = { id: 1 } as Vehicle & { rentals: Rental[] };
      site = { id: 1 } as Site;
      userService.getUserWithActiveRental.mockResolvedValue(user);
      vehicleService.getVehicleWithActiveRental.mockResolvedValue(vehicle);
      siteService.getSiteById.mockResolvedValue(site);
    });

    it("should throw if user policy validation failed", async () => {
      userRentalPolicy.verifyUserCanRentAVehicle.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() =>
        service.createRental(1, 1, 1, new Date(), new Date()),
      ).rejects.toThrow();
      expect(prismaService.rental.create).not.toHaveBeenCalled();
    });

    it("should throw if vehicle policy validation failed", () => {
      vehicleRentalPolicy.verifyVehicleCanBeRented.mockImplementationOnce(
        () => {
          throw new Error();
        },
      );

      expect(() =>
        service.createRental(1, 1, 1, new Date(), new Date()),
      ).rejects.toThrow();

      expect(prismaService.rental.create).not.toHaveBeenCalled();
    });

    it("should not throw if send notification failed", () => {
      notificationService.sendRentalConfirmNotification.mockRejectedValue(
        new Error(),
      );
      expect(() =>
        service.createRental(1, 1, 1, new Date(), new Date()),
      ).not.toThrow();
    });

    it("should create rental", async () => {
      const amount = 100;
      const startDate = new Date("1970-01-01");
      const endDate = new Date("1970-01-02");
      rentalAmountCalculatorService.calculateRentAmount.mockReturnValue(amount);
      await service.createRental(1, 1, 1, startDate, endDate);

      expect(prismaService.rental.create).toHaveBeenCalledWith({
        data: {
          vehicleId: 1,
          userId: 1,
          startSiteId: 1,
          amount,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      expect(
        notificationService.sendRentalConfirmNotification,
      ).toHaveBeenCalled();
    });
  });

  describe("completeRental", () => {
    let rental: Rental & { user: User; vehicle: Vehicle };
    let site: Site;

    beforeEach(() => {
      rental = { id: 1, user: { id: 1 }, vehicle: { id: 1 } } as Rental & {
        user: User;
        vehicle: Vehicle;
      };
      site = { id: 1 } as Site;

      prismaService.rental.findUnique.mockResolvedValue(rental);
      siteService.getSiteById.mockResolvedValue(site);
    });

    it("should throw if rental is not found", () => {
      prismaService.rental.findUnique.mockResolvedValueOnce(null);
      expect(service.completeRental(1, new Date(), 1)).rejects.toThrow(
        RentalNotFoundException,
      );
      expect(prismaService.vehicle.update).not.toHaveBeenCalled();
      expect(prismaService.rental.update).not.toHaveBeenCalled();
    });

    it("should throw if rental user is not found", () => {
      prismaService.rental.findUnique.mockResolvedValueOnce({
        id: 1,
        vehicle: { id: 1 },
      } as Rental & { vehicle: Vehicle });
      expect(service.completeRental(1, new Date(), 1)).rejects.toThrow(
        RentalUserNotFoundException,
      );
      expect(prismaService.vehicle.update).not.toHaveBeenCalled();
      expect(prismaService.rental.update).not.toHaveBeenCalled();
    });

    it("should throw if rental vehicle is not found", () => {
      prismaService.rental.findUnique.mockResolvedValueOnce({
        id: 1,
        user: { id: 1 },
      } as Rental & { user: User });
      expect(service.completeRental(1, new Date(), 1)).rejects.toThrow(
        RentalVehicleNotFoundException,
      );
      expect(prismaService.vehicle.update).not.toHaveBeenCalled();
      expect(prismaService.rental.update).not.toHaveBeenCalled();
    });

    it("should throw if rental policy validation failed", () => {
      rentalPolicy.verifyCanCompleteRental.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => service.completeRental(1, new Date(), 1)).rejects.toThrow();
      expect(prismaService.vehicle.update).not.toHaveBeenCalled();
      expect(prismaService.rental.update).not.toHaveBeenCalled();
    });

    it("should update vehicle site", async () => {
      await service.completeRental(1, new Date(), 1);
      expect(prismaService.vehicle.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { currentSiteId: 1 },
      });
    });

    it("should update rental", async () => {
      const date = new Date();
      await service.completeRental(1, date, 1);
      expect(prismaService.rental.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { completedAt: date, endSiteId: 1 },
      });
    });

    it("should notify rental complete", async () => {
      await service.completeRental(1, new Date(), 1);
      expect(
        notificationService.sendRentalCompleteNotification,
      ).toHaveBeenCalled();
    });

    it("should not throw if notification failed", () => {
      notificationService.sendRentalCompleteNotification.mockRejectedValue(
        new Error(),
      );
      expect(() => service.completeRental(1, new Date(), 1)).not.toThrow();
    });
  });
});
