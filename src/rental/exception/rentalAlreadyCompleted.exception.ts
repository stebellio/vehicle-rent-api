export class RentalAlreadyCompletedException extends Error {
  constructor(id: number) {
    super(`Rental with id ${id} already completed`);
  }
}
