export class RentalNotFoundException extends Error {
  constructor() {
    super(`Rental not found.`);
  }
}
