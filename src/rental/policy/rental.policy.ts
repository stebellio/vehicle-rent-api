import { Injectable } from "@nestjs/common";
import { Rental } from "generated/prisma";
import { RentalAlreadyCompletedException } from "../exception/rentalAlreadyCompleted.exception";
import { InvalidRentalCompleteDateException } from "../exception/invalidRentalCompleteDate.exception";

@Injectable()
export class RentalPolicy {
  verifyCanCompleteRental(rental: Rental, date: Date) {
    this.verifyRentalIsPending(rental);
    this.verifyRentalIsInFuture(rental, date);
  }

  private verifyRentalIsPending(rental: Rental) {
    if (rental.completedAt) {
      throw new RentalAlreadyCompletedException(rental.id);
    }
  }

  private verifyRentalIsInFuture(rental: Rental, date: Date) {
    const diff = date.getTime() - rental.startDate.getTime();
    if (diff < 0) {
      throw new InvalidRentalCompleteDateException(date);
    }
  }
}
