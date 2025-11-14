export class VehicleNotFoundException extends Error {
  constructor() {
    super("Vehicle not found.");
  }
}
