import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Patch,
  Post,
  UnprocessableEntityException,
} from "@nestjs/common";
import { RentalService } from "./rental.service";
import { CreateRentalDto } from "./requestDto/createRental.dto";
import { UserNotFoundException } from "../user/exception/userNotFound.exception";
import { VehicleNotFoundException } from "../vehicle/exception/vehicleNotFound.exception";
import { UserBusyException } from "./exception/userBusy.exception";
import { VehicleBusyException } from "./exception/vehicleBusy.exception";
import { VehicleWrongSiteException } from "./exception/vehicleWrongSite.exception";
import { CompleteRentalDto } from "./requestDto/completeRental.dto";

@Controller("rental")
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  @HttpCode(201)
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

      //TODO Complete exception handling

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

  @Patch("/complete/:id")
  @HttpCode(204)
  async complete(id: number, @Body() body: CompleteRentalDto) {
    Logger.debug("RentalController", "complete", JSON.stringify(body, null, 2));

    try {
      await this.rentalService.completeRental(
        id,
        new Date(body.date),
        body.endSiteId,
      );
    } catch (error) {
      //TODO Complete exception handling

      Logger.error("RentalController", "complete", error);
    }
  }
}
