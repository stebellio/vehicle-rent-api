import { Injectable } from "@nestjs/common";
import { Rental, User } from "generated/prisma";
import { UserBusyException } from "../exception/userBusy.exception";

@Injectable()
export class UserRentalPolicy {
  verifyUserCanRentAVehicle(user: User & { rentals: Rental[] }) {
    const isBusy = user.rentals.find((rental) => rental.completedAt === null);

    if (isBusy) {
      throw new UserBusyException(user.id);
    }
  }
}
