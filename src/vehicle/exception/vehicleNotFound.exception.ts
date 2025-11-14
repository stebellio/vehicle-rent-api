export class VehicleNotFoundException extends Error {
  constructor(id: number) {
    super("Vehicle with id " + id + " not found.");
  }
}
