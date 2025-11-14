export class RentalAlreadyCompletedException extends Error {
  constructor() {
    super(`Rental already completed`);
  }
}
