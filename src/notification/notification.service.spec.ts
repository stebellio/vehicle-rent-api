import { Test, TestingModule } from "@nestjs/testing";
import { NotificationService } from "./notification.service";
import Mocked = jest.Mocked;
import { INotificationStrategy } from "./strategy/notificationStrategy.interface";
import { mock } from "jest-mock-extended";
import { SendNotificationException } from "./exception/sendNotification.exception";
import { User, Vehicle, Rental, Site } from "generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { Logger } from "@nestjs/common";

describe("NotificationService", () => {
  let service: NotificationService;

  let strategy: Mocked<INotificationStrategy<unknown>>;

  beforeEach(async () => {
    strategy = mock<INotificationStrategy<unknown>>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: NotificationService,
          useValue: new NotificationService(strategy),
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    jest.spyOn(Logger, "error").mockImplementation(() => {});
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("sendRentalConfirmNotification", () => {
    let user: Mocked<User>;
    let vehicle: Mocked<Vehicle>;
    let rental: Mocked<Rental>;
    let site: Mocked<Site>;

    beforeEach(() => {
      user = mock<User>();
      vehicle = mock<Vehicle>();
      rental = mock<Rental>({
        endDate: new Date(),
        amount: new Decimal(100),
      });
      site = mock<Site>();
    });

    it("should handle error", () => {
      strategy.sendNotification.mockRejectedValue(new Error());
      expect(
        service.sendRentalConfirmNotification(user, vehicle, rental, site),
      ).rejects.toThrow(SendNotificationException);
    });

    it("should deliver notification", async () => {
      await service.sendRentalConfirmNotification(user, vehicle, rental, site);
      expect(strategy.sendNotification).toHaveBeenCalled();
    });
  });

  describe("sendRentalCompleteNotification", () => {
    let user: Mocked<User>;
    let vehicle: Mocked<Vehicle>;
    let rental: Mocked<Rental>;
    let site: Mocked<Site>;

    beforeEach(() => {
      user = mock<User>();
      vehicle = mock<Vehicle>();
      rental = mock<Rental>({
        completedAt: new Date(),
        amount: new Decimal(100),
      });
      site = mock<Site>();
    });

    it("should handle error", () => {
      strategy.sendNotification.mockRejectedValue(new Error());
      expect(
        service.sendRentalCompleteNotification(user, vehicle, rental, site),
      ).rejects.toThrow(SendNotificationException);
    });

    it("should deliver notification", async () => {
      await service.sendRentalCompleteNotification(user, vehicle, rental, site);
      expect(strategy.sendNotification).toHaveBeenCalled();
    });
  });
});
