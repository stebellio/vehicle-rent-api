export class RentalVehicleNotFoundException extends Error {
  constructor(id: number) {
    super(`Rental vehicle with id ${id} not found.`);
  }
}
