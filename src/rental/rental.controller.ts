import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './requestDto/createRental.dto';
import { UserService } from '../user/user.service';
import e from 'express';
import { UserNotFoundException } from '../user/exception/userNotFound.exception';
import { VehicleService } from '../vehicle/vehicle.service';
import { VehicleNotFoundException } from '../vehicle/exception/vehicleNotFound.exception';

@Controller('rental')
export class RentalController {
  constructor(
    private readonly userService: UserService,
    private readonly vehicleService: VehicleService,
    private readonly rentalService: RentalService,
  ) {}

  @Post()
  async create(@Body() body: CreateRentalDto) {
    Logger.debug('RentalController', 'create', JSON.stringify(body, null, 2));

    try {
      const user = await this.userService.getUser(body.userId);
      const vehicle = await this.vehicleService.getVehicle(body.vehicleId);

      const rental = await this.rentalService.createRental(
        user,
        vehicle,
        body.startSiteId,
        body.startDate,
      );

      return {
        id: rental.id,
      };
    } catch (error) {
      Logger.error('RentalController', 'create', error);

      if (
        error instanceof UserNotFoundException ||
        error instanceof VehicleNotFoundException
      ) {
        throw new NotFoundException(error);
      }

      throw new InternalServerErrorException();
    }
  }
}
