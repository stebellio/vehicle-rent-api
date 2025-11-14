export class RentalNotFoundException extends Error {
  constructor(id: number) {
    super(`Rental with id ${id} not found.`);
  }
}
