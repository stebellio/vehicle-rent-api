export class VehicleBusyException extends Error {
  constructor() {
    super(`Vehicle is busy`);
  }
}
