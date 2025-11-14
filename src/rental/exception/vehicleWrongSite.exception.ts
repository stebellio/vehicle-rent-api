export class VehicleWrongSiteException extends Error {
  constructor() {
    super(`Vehicle is not located at the rental site`);
  }
}
