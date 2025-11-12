export class VehicleBusyException extends Error {
  constructor(id: number) {
    super(`Vehicle with id ${id} is busy`);
  }
}
