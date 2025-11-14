export class RentalVehicleNotFoundException extends Error {
  constructor() {
    super(`Rental vehicle not found.`);
  }
}
