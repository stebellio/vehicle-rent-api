import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
  UnprocessableEntityException,
} from "@nestjs/common";
import { RentalService } from "./rental.service";
import { CreateRentalDto } from "./requestDto/createRental.dto";
import { UserService } from "../user/user.service";
import e from "express";
import { UserNotFoundException } from "../user/exception/userNotFound.exception";
import { VehicleService } from "../vehicle/vehicle.service";
import { VehicleNotFoundException } from "../vehicle/exception/vehicleNotFound.exception";
import { UserBusyException } from "./exception/userBusy.exception";
import { VehicleBusyException } from "./exception/vehicleBusy.exception";
import { VehicleWrongSiteException } from "./exception/vehicleWrongSite.exception";
import { SendNotificationException } from "../notification/exception/sendNotification.exception";
import { NotificationService } from "../notification/notification.service";

@Controller("rental")
export class RentalController {
  constructor(
    private readonly rentalService: RentalService,
    private readonly notificationService: NotificationService,
  ) {}

  @Post()
  async create(@Body() body: CreateRentalDto) {
    Logger.debug("RentalController", "create", JSON.stringify(body, null, 2));

    try {
      const rental = await this.rentalService.createRental(
        body.userId,
        body.vehicleId,
        body.startSiteId,
        new Date(body.startDate),
        new Date(body.endDate),
      );

      return {
        id: rental.id,
      };
    } catch (error) {
      Logger.error("RentalController", "create", error);

      if (
        error instanceof UserNotFoundException ||
        error instanceof VehicleNotFoundException
      ) {
        throw new NotFoundException(error.message);
      }

      if (
        error instanceof UserBusyException ||
        error instanceof VehicleBusyException
      ) {
        throw new ConflictException(error.message);
      }

      if (error instanceof VehicleWrongSiteException) {
        throw new UnprocessableEntityException(error.message);
      }

      throw new InternalServerErrorException();
    }
  }
}
