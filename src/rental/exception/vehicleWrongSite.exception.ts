export class VehicleWrongSiteException extends Error {
  constructor(id: number) {
    super(`Vehicle with id ${id} is not located at the rental site`);
  }
}
